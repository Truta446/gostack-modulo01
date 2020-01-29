const express = require('express')

const server = express()

server.use(express.json())

const projects = []

server.use((req, res, next) => {
    console.count("Number of requests")

    return next()
})

const checkIdExists = (req, res, next) => {
    const { id } = req.params

    const project = projects.find(project => project.id === id)

    if (!project) return res.status(400).json({ error: "Project does not exists." })

    return next()
}

const validateBodyRequest = (req, res, next) => {
    const { id, title } = req.body

    if (!id || !title) return res.status(400).json({ error: "Request with missing params." })

    if (projects.find(project => project.id === id)) return res.status(400).json({ error: "Id already in use. Choose another Id to creatre a project." })
    
    return next()
}

const checkTitleIsEqual = (req, res, next) => {
    const { title } = req.body
    const { id } = req.params

    projectIndex = projects.findIndex(project => project.id === id)
    
    if (projects[projectIndex].title === title) return res.status(400).json({ error: "Update not necessary because old title is equal to new title." })

    return next()
}

server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.post('/projects', validateBodyRequest,  (req, res) => {
    projects.push({ ...req.body, tasks: [] })

    return res.json({
        message: `Project ${req.body.title} add with success!`,
        projects
    })
})

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
    const { id } = req.params

    projectIndex = projects.findIndex(project => project.id === id)

    projects[projectIndex].tasks.push(req.body.title)

    return res.json({
        message: `Task '${req.body.title}' add on project '${projects[projectIndex].title}' with success!`,
        projects
    })
})

server.put('/projects/:id', checkIdExists, checkTitleIsEqual, (req, res) => {
    const { id } = req.params

    projectIndex = projects.findIndex(project => project.id === id)

    oldTitle = projects[projectIndex].title

    projects[projectIndex].title = req.body.title

    return res.json({
        message: `Project updated from '${oldTitle}' to '${req.body.title}' with success!`,
        projects
    })
})

server.delete('/projects/:id', checkIdExists, (req, res) => {
    const { id } = req.params

    projectIndex = projects.findIndex(project => project.id === id)

    const oldTitle = projects[projectIndex].title

    projects.splice(projectIndex, 1)
    
    return res.json({
        message: `Project '${oldTitle}' deleted with success!`,
        projects
    })
})

server.listen(3001)
