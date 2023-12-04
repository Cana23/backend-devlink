const connection = require('../db/dbConfig')
const bcrypt = require('bcrypt');
const GitHubStrategy = require('passport-github').Strategy;

const fetch = (...args) =>
    import ('node-fetch').then(({default: fetch})=> fetch(...args))

const CLIENT_ID = 'eb65046c0d5c4f4b9c06'                                    //Poner en un .env proxima vez
const CLIENT_SECRET = '94bd183f5f8df34d526cebd9c674cbccc04633da'            //Poner en un .env proxima vez


const autenticationController = {

    getAccessToken: async function (req, res){      //Obtiene el token de acceso de un usuario de github despues de que inicie sesion 
        const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;
            await fetch("https://github.com/login/oauth/access_token" + params, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                }
            }).then((response) => {
                console.log('respuesta recibida')
                return response.json();
            }).then((data) => {
                res.json(data);
                console.log('Token accesado')  
            })
    },

    getUserData: async function (req, res){         //Usa ese mismo token para obtener la info del usuario, pero o que nos compete es el username 
        req.get("Authorization")
        await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": req.get("Authorization")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            res.json(data);
            console.log('Data accesado')
        })
    },

    register: async (req, res) => {                //Registrar usuario, duhhhhh       
        const { username, finalEmail, password} = req.body;
        console.log('we got sum')
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const CHECK_EMAIL_QUERY = `SELECT * FROM Users WHERE email = '${finalEmail}'`;
            connection.query(CHECK_EMAIL_QUERY, (err, results) => {
                if (err) {
                    console.log('Verificacion del correo incorrecta')
                    res.status(500).send('Error al verificar el correo electrónico');
                } else {
                    if (results.length > 0) {
                        console.log('Verificacion del correo incorrecta, como si estuviera duplicada')
                        res.status(409).send('El correo electrónico ya está registrado');
                    } else {
                        const CHECK_USERNAME_QUERY = `SELECT * FROM Users WHERE username = '${username}'`;
                        connection.query(CHECK_USERNAME_QUERY, (err, usernameResults) => {
                            if (err) {
                                console.log('Error al verif nombre')
                                res.status(500).send('Error al verificar el nombre de usuario');
                            } else {
                                if (usernameResults.length > 0) {
                                    res.status(409).send('El nombre de usuario ya está registrado');
                                } else {
                                    console.log('Error en insert')
                                    const INSERT_USER_QUERY = `INSERT INTO Users (username, email, password, origen) VALUES ('${username}', '${finalEmail}', '${hashedPassword}', 'DevLink')`;
                                    connection.query(INSERT_USER_QUERY, (err, insertResults) => {
                                        if (err) {
                                            res.status(500).send('Error al registrar el usuario');
                                            console.log(err)
                                        } else {
                                            res.status(200).send('Usuario registrado con éxito');
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        } catch (error) {
            res.status(500).send('Error en el servidor');
        }
    },

    login: async (req, res) => {                    //Duhhhhhhhhhhhhh 
        const { finalEmail, password } = req.body; //Revisar, no deberia funcionar, no usa password, asi que deberia dejar entrar con la password incorrecta y en plaintext
        const SELECT_USER_QUERY = `SELECT * FROM Users WHERE email = '${finalEmail}'`;
    
        connection.query(SELECT_USER_QUERY, async (err, results) => {
            if (err) {
                res.status(500).send('Error al iniciar sesión');
            } else {
                if (results.length > 0) {
                    // Envía la información del usuario en lugar de un mensaje de éxito
                    res.status(200).json(results[0]);
                } else {
                    res.status(401).send('Credenciales inválidas');
                }
            }
        });
    },

    githubLogin: (req, res) => { 
        console.log(req.body)
        const user = req.body.ghUser;
        const SELECT_USER_QUERY = `SELECT * FROM Users WHERE username = '${user}'`;
    
        connection.query(SELECT_USER_QUERY, async (err, results) => {
            if (err) {
                res.status(500).send('Error al iniciar sesión');
            } else {
                if (results.length > 0) {
                    const existingUser = results[0];
                    res.status(200).json(existingUser);
                    console.log('User exists');
                } else {
                    console.log('User does not exist');
    
                    const INSERT_USER_QUERY = 'INSERT INTO Users (username,email, origen) VALUES ( ?, "Ninguno" ,"Github" )';
                    const values = [user];
    
                    connection.query(INSERT_USER_QUERY, values, (insertErr, insertRes) => {
                        if (insertErr) {
                            res.status(500).send('Error al registrar el usuario');
                            console.log(insertErr);
                        } else {
                            const getUserQuery = 'SELECT * FROM Users WHERE Id = ?'
                            const idInsert = insertRes.insertId
                            
                                connection.query(getUserQuery,idInsert, (userErr, userRes) => {
                                    if(userErr){
                                        res.status(500).send('Error al conseguir el usuario');
                                        console.log(insertErr);
                                    }else {
                                        res.status(200).json(userRes[0])
                                        console.log(userRes)
                                    }
                                })
                        }
                    });
                }
            }
        });
    },
    

    
}
module.exports = autenticationController //Se que era autHentication, pero se me fue la h y es demasiado tarde para corregirlo