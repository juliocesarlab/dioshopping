import { useState, useEffect } from 'react';
import { Grid, Button, TextField } from '@material-ui/core/';

const Contatos = () => {

    const url = 'http://localhost:5000/message'
    const [message, setMessage] = useState([]);
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [validator, setValidator] = useState(false);
    const [render, setRender] = useState(false);
    const [success, setSuccess] = useState(false);
    const [search, setSearch] = useState('')

    useEffect(async () => {
        const response = await fetch(url)
        const data = await response.json();
        if (search.length > 0) filterData(data)
        else setMessage(data);
        console.log(data)
        
    }, [render, search])

    function filterData(data) {
        const filteredData = data.filter(message => 
            message.email.startsWith(search) || message.email.includes(search))
        setMessage(filteredData)
    }

    function removeItem(id) {
        /*Aqui eu poderia fazer uma requisição http com delete para remover do bd
        mas como não existe essa opção na api, removerei o item tela*/
        const filteredData = message.filter(msg => msg.id !== id)
        setMessage(filteredData)
    }

    const sendMessage = async () => {
        setValidator(false);
        if(author.length <= 0 || content.length <= 0){
            return setValidator(!validator)
        }
        const bodyForm = {
            email: author,
            message: content,
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyForm)
        })
        const result = response.json()
        const { id } = result
        if(id) {
            setRender(true);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 5000)
        }
        setAuthor('');
        setContent('');
    }  

    return(
        <>
            <Grid container direction="row" xs={12}>
                <TextField id="name" label="Name" value={author} onChange={(event)=>{setAuthor(event.target.value)}} fullWidth/>
                <TextField id="message" label="Message" value={content} onChange={(event)=>{setContent(event.target.value)}} fullWidth/>
            </Grid>

            <div className="mt-3 mb-3">
                <label for="exampleFormControlInput1" className="form-label">Procure por um autor</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Digite o nome de algum autor das mensagens" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {validator && 
                <div className="alert alert-warning alert-dismissible fade show mt-2" role="alert">
                    <strong>Por favor preencha todos os campos!</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }

            {success && 
                <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                    <strong>Mensagem foi enviada</strong>
                </div>
            }

            <Button onClick={sendMessage} className="mt-2" variant="contained" color="primary">
                Sent
            </Button>

            {message.map((content) => {
                return(
                    <div className="card mt-2" key={content.id}>
                        <div className="card-body">
                            <div class="d-flex justify-content-between">
                                <h5 className="card-title">{content.email}</h5>
                                <button type="button" class="btn btn-danger" onClick={(e) => removeItem(content.id)}>
                                    Delete
                                </button>
                            </div>
                            <p className="card-text">{content.message}</p>
                            <p className="card-text"><small className="text-muted">{content.created_at}</small></p>
                        </div>
                    </div>
                )
            } )}
        </>
    )
}

export default Contatos;
