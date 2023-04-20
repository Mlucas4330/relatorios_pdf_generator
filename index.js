const express = require('express');
const moment = require('moment');
const app = express()
const pdf = require('html-pdf');

app.use(express.json());

function formata_hora(hora){
    //2000-01-01T21:13:00.000Z
    return hora.substr(11, 5)
}

const options = {
    type: 'pdf',
    format: 'A4',
    orientation: 'portrait'
}

const dias_semana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira'];


app.post("/generate_pdf", async (req, res) => {
    const { tickets } = await req.body;

    console.log(tickets)

    const tickets_segunda = tickets.filter(ticket => ticket.dia_semana === dias_semana[0]);
    const tickets_terca = tickets.filter(ticket => ticket.dia_semana === dias_semana[1]);
    const tickets_quarta = tickets.filter(ticket => ticket.dia_semana === dias_semana[2]);
    const tickets_quinta = tickets.filter(ticket => ticket.dia_semana === dias_semana[3]);
    const tickets_sexta = tickets.filter(ticket => ticket.dia_semana === dias_semana[4]);

    const concluidos = tickets.filter(ticket => ticket.status === "Enviado para testes" || ticket.status === "Concluído");
    const retornados = tickets.filter(ticket => ticket.status === "Retornado dos testes")

    let html_segunda = '';
    tickets_segunda.forEach(dia => {
        html_segunda += `<div>${formata_hora(dia.hora_inicio)} - ${formata_hora(dia.hora_fim)} - Ticket ${dia.codigo}, ${dia.descricao}.</div>`
        return html_segunda;
    })

    let html_terca = '';
    tickets_terca.forEach(dia => {
        html_terca += `<div>${formata_hora(dia.hora_inicio)} - ${formata_hora(dia.hora_fim)} - Ticket ${dia.codigo}, ${dia.descricao}.</div>`
        return html_terca
    })

    let html_quarta = '';
    tickets_quarta.forEach(dia => {
        html_quarta += `<div>${formata_hora(dia.hora_inicio)} - ${formata_hora(dia.hora_fim)} - Ticket ${dia.codigo}, ${dia.descricao}.</div>`
        return html_quarta
    })

    let html_quinta = '';
    tickets_quinta.forEach(dia => {
        html_quinta += `<div>${formata_hora(dia.hora_inicio)} - ${formata_hora(dia.hora_fim)} - Ticket ${dia.codigo}, ${dia.descricao}.</div>`
        return html_quinta
    })

    let html_sexta = '';
    tickets_sexta.forEach(dia => {
        html_sexta += `<div>${formata_hora(dia.hora_inicio)} - ${formata_hora(dia.hora_fim)} - Ticket ${dia.codigo}, ${dia.descricao}.</div>`
        return html_sexta
    })


    let html_trabalhados = '';
    tickets.forEach(ticket => {
        html_trabalhados += `<li>${ticket.codigo}</li>`
        return html_trabalhados
    })

    let html_retornados = '';
    retornados.forEach(ticket => {
        html_retornados += `<li>${ticket.codigo}</li>`
        return html_retornados
    })

    let html_concluidos = '';
    concluidos.forEach(ticket => {
        html_concluidos += `<li>${ticket.codigo}</li>`
        return html_concluidos
    })

    let html = `<div>
                    <div>
                        <h3><strong>${dias_semana[0]}</strong></h3>
                        ${html_segunda}
                    </div>
                    <div>
                        <h3><strong>${dias_semana[1]}</strong></h3>
                        ${html_terca}
                    </div>
                    <div>
                        <h3><strong>${dias_semana[2]}</strong></h3>
                        ${html_quarta}
                    </div>
                    <div>
                        <h3><strong>${dias_semana[3]}</strong></h3>
                        ${html_quinta}
                    </div>
                    <div>
                        <h3><strong>${dias_semana[4]}</strong></h3>
                        ${html_sexta}
                    </div>
                </div>
                <div style="margin-top: 50px;">
                Tarefas da semana que foram trabalhadas:
                    <ul>
                        ${html_trabalhados}
                    </ul>
                Tarefas da semana que voltaram com bug:
                    <ul>
                       ${html_retornados}  
                    </ul>
                Tarefas da semana enviadas para teste/resolvidas:
                    <ul>
                        ${html_concluidos} 
                    </ul>
                </div>
                `

    pdf.create(html, options).toFile("./PDF/relatorio_semanal.pdf", (err) => {
        if (err) return res.status(500).json(err);

        res.sendFile(`${__dirname}/PDF/relatorio_semanal.pdf`)
    })
})

app.listen(3001, () => {
    console.log("Rodando")
})

