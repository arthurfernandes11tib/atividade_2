import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(express.static('../web')) // Serve frontend files

const pool = mysql.createPool({
    host: 'benserverplex.ddns.net',
    user: 'alunos',
    password: 'senhaAlunos',
    database: 'web_03mb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.post('/products', async (req, res) => {
    try {
        const { name, price, description, category } = req.body
        const [result] = await pool.query(
            'INSERT INTO produtos_ArthurF (name, price, description, category) VALUES (?, ?, ?, ?)',
            [name, price, description, category]
        )
        res.status(201).json({ message: 'Produto salvo com sucesso', id: result.insertId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao salvar produto', error: error.message })
    }
})

app.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, price, description, category FROM produtos_ArthurF')
        res.status(200).json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message })
    }
})

app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [rows] = await pool.query('SELECT id, name, price, description, category FROM produtos_ArthurF WHERE id = ?', [id])
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' })
        }
        res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao buscar produto', error: error.message })
    }
})

app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, description, category } = req.body
        const [result] = await pool.query(
            'UPDATE produtos_ArthurF SET name = ?, price = ?, description = ?, category = ? WHERE id = ?',
            [name, price, description, category, id]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' })
        }
        res.status(200).json({ message: 'Produto atualizado com sucesso' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message })
    }
})

app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [result] = await pool.query('DELETE FROM produtos_ArthurF WHERE id = ?', [id])
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' })
        }
        res.status(200).json({ message: 'Produto apagado com sucesso' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao apagar produto', error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
