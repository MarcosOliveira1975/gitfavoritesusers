export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadatrado!')
            }

            const user = await GithubUser.search(username)
      
            if(user.login === undefined) {
              throw new Error('Usuário não encontrado!')
            }
      
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
      
          } catch(error) {
            alert(error.message)
          }
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        console.log(this.entries)
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
      }

    delete(user) {
        const filteredEntries = this.entries
          .filter(entry => entry.login !== user.login)
    
        this.entries = filteredEntries
        this.update()
        this.save()
      }
}

export class FavoritesView extends Favorites {
        constructor(root) {
            super(root)

            this.tbody = this.root.querySelector('table tbody')

            this.update()
            this.onadd()
        }

        onadd() {
            const addButton = this.root.querySelector('#addButton')
            addButton.onclick = () => {
                const { value } = this.root.querySelector('#input-search')

                this.add(value)
            }
        }

        update() {
           this.removeAllTr() 
        
        this.entries.forEach(user => {
            
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Foto de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar esse usuário?')
                if(isOk) {
                  this.delete(user)
                }
              }
         
            this.tbody.append(row)
        })
                
        }

        createRow() {       
            const tr = document.createElement('tr')

           tr.innerHTML = `           
                    <td class="user">
                        <img src="https://github.com/marcosoliveira1975.png" alt="Foto do usuário.">
                        <a href="https://github.com/marcosoliveira1975" target="_blank">
                        <p>Marcos Oliveira</p>
                        <span>marcosoliveira1975</span>
                        </a>
                    </td>
                    <td class="repositories">33</td>
                    <td class="followers">47</td>
                    <td class="remove">Remover</td>
                `


                return tr
        }

        removeAllTr() {

            this.tbody.querySelectorAll('tr').forEach((tr) => {
                tr.remove()
            });
        }
}   