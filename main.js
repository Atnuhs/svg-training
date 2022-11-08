Tasks = null




const taskInputFormArea = () => {
    let container = document.createElement("div")
    container.style.width = "500px"
    container.style.backgroundColor = "#afa"
    let taskNameSpace = document.createElement("div")
    let startTimeSpace = document.createElement("div")
    let finishTimeSpace = document.createElement("div")

    let taskNameLabel = document.createElement("p")
    taskNameLabel.innerText = "タスク名"
    let startTimeLabel = document.createElement("p")
    startTimeLabel.innerText = "開始時間"
    let finishTimeLabel = document.createElement("p")
    finishTimeLabel.innerText = "終了時間"

    taskNameInput = document.createElement("input")
    taskNameInput.id = "task-name-input"
    startTimeInput = document.createElement("input")
    startTimeInput.id = "start-time-input"
    startTimeInput.type = "time"
    finishTimeInput = document.createElement("input")
    finishTimeInput.id = "finish-time-input"
    finishTimeInput.type = "time"

    let submit = document.createElement("button")
    submit.innerText = "登録"
    submit.style.backgroundColor = "#9af"
    submit.style.border = "solid 0px"
    submit.style.borderRadius = "5px"
    submit.style.fontSize = "20px"
    submit.style.cursor = "pointer"
    submit.addEventListener("click", submitTask)

    taskNameSpace.appendChild(taskNameLabel)
    taskNameSpace.appendChild(taskNameInput)

    startTimeSpace.appendChild(startTimeLabel)
    startTimeSpace.appendChild(startTimeInput)

    finishTimeSpace.appendChild(finishTimeLabel)
    finishTimeSpace.appendChild(finishTimeInput)

    container.appendChild(taskNameSpace)
    container.appendChild(startTimeSpace)
    container.appendChild(finishTimeSpace)
    container.appendChild(submit)
    return container
}

const describeTasksArea = () => {
    let container = document.createElement("div")
    container.id = "describe-tasks-area"
    container.style.width = "500px"
    container.style.backgroundColor = "#ccd"
    return container
}

const graphArea = () => {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "500")
    svg.setAttribute("height", "500")
    svg.setAttribute("viewbox", "0 0 500 500")
    svg.setAttribute("style", "background-color:#aea")
    svg.id = "graph-area"
    return svg
}

class TaskData {
    constructor (taskName, startTime, finishTime) {
        this.taskName = taskName
        this.startTime = startTime
        this.finishTime = finishTime
    }

    strTimeToSec(strTime) {
        // strTime => XX:YY typeof strTime => string
        // return XX * 3600 + YY * 60 

        let [XX, YY] = strTime.split(":")
        return XX*3600 + YY*60
    }

    secToRadian(sec) {
        let DaySec = 24*60*60
        return sec / DaySec * 2 * Math.PI
    }

    startRadian() {
        return this.secToRadian(this.strTimeToSec(this.startTime))
    }

    finishRadian() {
        return this.secToRadian(this.strTimeToSec(this.finishTime))
    }
}

const describeTask = () => {
    let container = document.getElementById("describe-tasks-area")

    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
    let i=0
    Tasks.forEach(task => {
        let taskContainer = document.createElement("div")
        taskContainer.innerText = `${task.taskName}: ${task.startTime}: ${task.finishTime}`
        fillColor = `hsl(${(i/Tasks.length)*360}, 50%, 70%)`
        taskContainer.style.backgroundColor = fillColor
        container.appendChild(taskContainer)
        i++
    })

}

const drawGraph = () => {
    svg = document.getElementById("graph-area")
    let w = svg.getAttribute("width")
    let h = svg.getAttribute("height")
    let cx = w/2
    let cy = h/2 
    let radius = cx * 0.8
    graphCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    graphCircle.setAttribute("cx", cx)
    graphCircle.setAttribute("cy", cy)
    graphCircle.setAttribute("r", radius)
    graphCircle.setAttribute("fill", "None")
    graphCircle.setAttribute("stroke", "#090")
    svg.appendChild(graphCircle)

    for (let i=0; i<24; i++) {
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text")
        let x = Math.sin((i/24)*2*Math.PI)*cx*0.87 + cx
        let y = -Math.cos((i/24)*2*Math.PI)*cy*0.87 + cy
        text.innerHTML = `${i}`
        text.setAttribute("x", `${x}`)
        text.setAttribute("y", `${y}`)
        text.setAttribute("text-anchor", "middle")
        text.setAttribute("dominant-baseline", "central")
        text.setAttribute("font-family", "san-serif")
        text.setAttribute("font-size", "22")
        svg.appendChild(text)

        let line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        x = Math.sin((i/24)*2*Math.PI)*cx*0.8+ cx
        y = -Math.cos((i/24)*2*Math.PI)*cy*0.8 + cy
        line.setAttribute("x1", `${cx}`)
        line.setAttribute("y1", `${cy}`)
        line.setAttribute("x2", `${x}`)
        line.setAttribute("y2", `${y}`)
        line.setAttribute("stroke", "#0904")
        line.setAttribute("stroke-dasharray", "20,8")
        svg.appendChild(line)
    }
    let i=0
    Tasks.forEach(task => {
        let sx = Math.sin(task.startRadian())*radius + cx
        let sy = -Math.cos(task.startRadian())*radius + cy
        let gx = Math.sin(task.finishRadian())*radius + cx
        let gy = -Math.cos(task.finishRadian())*radius + cy
        let rad = task.finishRadian() - task.startRadian() 
        while (rad < 0) {rad += 2*Math.PI}
        let largeArcSweepFlag = rad <= Math.PI ? 0 : 1
        let pie = document.createElementNS("http://www.w3.org/2000/svg", "path")
        pie.setAttribute("d", `M${cx} ${cy} L ${sx} ${sy} A ${radius} ${radius} 0 ${largeArcSweepFlag} 1 ${gx} ${gy} Z`)
        fillColor = `hsl(${(i/Tasks.length)*360}, 70%, 50%)`
        pie.setAttribute("fill", `${fillColor}`)
        pie.setAttribute("fill-opacity", "50%")
        svg.appendChild(pie)
        i++
    })

}

const submitTask = () => {
    let taskName = document.getElementById("task-name-input").value
    let startTime = document.getElementById("start-time-input").value
    let finishTime = document.getElementById("finish-time-input").value
    let taskData = new TaskData(taskName, startTime, finishTime)

    if (taskName === "" || startTime === "" || finishTime === "") {
        return
    }

    Tasks.push(taskData)
    clearTaskInputFormArea()
    describeTask()
    drawGraph()
}

const clearTaskInputFormArea = () => {
    let taskName = document.getElementById("task-name-input")
    let startTime = document.getElementById("start-time-input")
    let finishTime = document.getElementById("finish-time-input")
    taskName.value = ""
    startTime.value = ""
    finishTime.value = ""
}


const init = () => {
    Tasks = []
    let container = document.createElement("div")
    container.appendChild(taskInputFormArea())
    container.appendChild(describeTasksArea())
    container.appendChild(graphArea())
    document.body.appendChild(container)
    drawGraph()
}

window.onload = () => {
    init()
}