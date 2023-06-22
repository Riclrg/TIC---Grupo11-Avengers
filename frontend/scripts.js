async function consultaPosts(){
    let aux = document.cookie.split('=')
    let userId = Number(aux[1])
    const posts = await fetch(`http://localhost:3333/posts/user/${userId}`)
                        .then(resposta => {
                            return resposta.json()
                        })

    let conteudoTabela = ''
    posts.forEach( post => {
        conteudoTabela += `<tr> <td> ${post.id} </td> <td> ${post.code} </td> <td> ${post.patrimony} </td> <td> ${post.description} </td> <td> ${post.date} </td> <td> ${post.local} </td> <td> ${post.status} </td> <td> <button onclick="remover(${post.id})"> <i class="bi bi-trash"></i> </button> </td> <td> <button onclick="editar(${post.id}, ${post.code}, '${post.patrimony}', '${post.description}', '${post.date}', '${post.local}', ${post.status})">  <i class="bi bi-pencil"></i> </button> </td> </tr>`
    })
    document.getElementById("corpoTabela").innerHTML = conteudoTabela

}

function editar(id, code, patrimony, description, date, local, status){
    document.getElementById("id").value = id;
    document.getElementById("code").value = code;
    document.getElementById("patrimony").value = patrimony;
    document.getElementById("description").value = description;
    document.getElementById("date").value = date;
    document.getElementById("local").value = local;
    (status) ? document.getElementById("funciona").checked = true : 
                  document.getElementById("nfunciona").checked = true
}


async function remover(id){
    const confirmacao = confirm('Confirma a exclusão do Post? ')
    if (!confirmacao){
        return 
    }
    await fetch(`http://localhost:3333/post/${id}`, {
        method: 'DELETE'
    })
    .then(resposta => {
        alert('Remoção realizada')
    })
    .catch(error => {
        alert('Problema na remoção')
    })
    consultaPosts() 
}
async function confirmar(){
    const code = Number(document.getElementById("code").value)
    const patrimony = document.getElementById("patrimony").value
    const description = document.getElementById("description").value
    const date = document.getElementById("date").value
    const local = document.getElementById("local").value
    const status = document.getElementById("funciona").checked
    const id = Number(document.getElementById("id").value)
   
    let corpo
    let verbo
    if (id) {
        corpo = {id, code, patrimony, description, date, local, status}
        verbo = 'PUT'
    }
    else { 
        let aux = document.cookie.split('=')
        let userId = Number(aux[1])
        corpo = {code, patrimony, description, date, local, status, userId}
        verbo = 'POST'
    }
     
    const post = await fetch('http://localhost:3333/post', {
        method: verbo,
        body: JSON.stringify(corpo),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    })
    .then( resposta => {
       alert('Operação realizada com sucesso')
    })
    .catch(error => {
        alert('Operação falhou')
    })
    consultaPosts()
    document.getElementById("id").value = ''
    document.getElementById("patrimony").value = ''
    document.getElementById("description").value = ''
    document.getElementById("date").value = ''
    document.getElementById("local").value = ''
    document.getElementById("funciona").checked = false
    document.getElementById("nfunciona").checked = false
}

async function entrar(){
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        const corpo = {username, password}
        let resposta = await fetch(`http://localhost:3333/user/verifica`, {
            method: 'POST',
            body: JSON.stringify(corpo),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
        .then(resp => {
                return resp.json()
        })
        .catch(error => {
                alert(`Erro na execução ${error}`)
                exit(0) 
        })
        if (resposta == null){
            alert('Usuário/Senha não existem')
        }
        else {
            document.cookie = `id=${resposta.id}`
            window.open(`http://127.0.0.1:5500/frontend/post.html`);   
        }
       
    }

    async function deslocar(){
        const id = Number(document.getElementById("post").value)
        const local = Number(document.getElementById("local").value)
        const objeto = {id, local}
        const resultado = await fetch('http://localhost:3333/post/local', {
            method: 'PATCH',
            body: JSON.stringify(objeto),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
        .then(resp => {
            alert('Patrimonio movido com sucesso')
        })
        .catch(error => {
            alert('Problema na movimentação')
        })
    }