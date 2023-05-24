export class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
        GithubUser.search('Christian014').then(user => console.log(user))
        
    }

    load() {
        this.entriesUser = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }
    save (){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entriesUser))
    }

    delete(user){
        const filteredEntries = this.entriesUser.filter(entry => entry.login !== user.login)
            
            this.entriesUser = filteredEntries
            this.update()
            this.save()
    }
    
    async add(username){
        try{
            const userExists = this.entriesUser.find(entry => entry.login === username)
            console.log(userExists)

            if(userExists){
                throw new Error('usuario já cadastrado')
            }
            const user = await GithubUser.search(username)

            if (user.login === undefined){
                throw new Error(` não encontrado`)
            }

            this.entriesUser = [user, ...this.entriesUser]
            this.update()
            this.save()
        }catch(error){
            alert(error.message)
        }

    }

    onadd(){
        const addButton = this.root.querySelector('.inputs-header button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.inputs-header .inputText')
            this.add(value)
        }
    }
}

export class FavoritesUsers extends Favorites {
    constructor(root){
        super(root)

        this.tbody = document.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    update(){
        this.removeUsersTr()
        
        this.entriesUser.forEach( user => {
            const rowUser = this.createInnerUser()
            
            rowUser.querySelector('.user-img img').src = `https://github.com/${user.login}.png`

            rowUser.querySelector('.user-img a').href = `https://github.com/${user.login}`

            rowUser.querySelector('.user-img p').textContent = user.name

            rowUser.querySelector('.user-img span').textContent = user.login

            rowUser.querySelector('.user-repositories span').textContent = user.public_repos

            rowUser.querySelector('.user-followers span').textContent = user.followers
           
            rowUser.querySelector('.user-button button').onclick = () => {
                const isOk = confirm('Tem certeza que deseja excluir esse favorito?')

                if (isOk) {
                    this.delete(user)
                }
            }

            this.tbody.appendChild(rowUser)
        })

    }

    removeUsersTr(){
        

        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

    createInnerUser(){
        const tr = document.createElement('tr')
        const content = `

                    <td class="user-img">
                        <img src="https://github.com/{Christian014}.png" alt="image christian">
                        <a href="https://github.com/Christian014" target="_blank">
                        <p>Christian Lopes</p>
                        <span>Christian014</span>
                    </td>
                    <td class="user-repositories">
                        <span>120</span>
                    </td>
                    <td class="user-followers">
                        <span>100</span>
                    </td>
                    <td class="user-button">
                        <button>Remover</button>
                    </td>

        `
        tr.innerHTML = content
        return tr
    }
}

export class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}