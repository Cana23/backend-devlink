const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Uploads folder where files will be saved
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });
const upload = multer({ storage: storage });


const authenticationController = require('./controllers/autenticationController');
const editProfileController = require('./controllers/editPerfilControllers');
const userController = require('./controllers/UserController')

const likesController = require('./controllers/likesController');
const postController = require('./controllers/postController');
const dashUsersController = require('./controllers/dashUsersController');
const dashPostControllers = require('./controllers/dashPostControllers');

//Authentication controller:
    router.get('/getAccessToken', authenticationController.getAccessToken);
    router.get('/getUserData', authenticationController.getUserData);
    router.post('/Register', authenticationController.register);
    router.post('/Login', authenticationController.login)
    router.post('/register/github', authenticationController.githubLogin)
    

//Edit profile Controller:
    router.put('/add/github/:id', editProfileController.linkGithub);
    router.put('/editar/foto', upload.single('img'), editProfileController.editImg);
    router.put('/editar/email/:id  ', editProfileController.editEmail);
    router.put('/editar/password/:id', editProfileController.editPassword);
    router.put('/editar/description/:id', editProfileController.editDescription);
    router.put('/ubicacion/:id', editProfileController.editLocation);
    router.delete('/eliminar/usuario/:id', editProfileController.deleteUser);


//User Controller:
    router.get('/users', userController.users);
    router.get('/perfil/:user', userController.ProfileUser);
    router.get('/publicaciones/:user', userController.PublicationsUser);
    router.get('/comentariosRender/:user', userController.CommentsUser);


//Like Controller:
    router.post('/like', likesController.like);
    router.get('/likes/:postId', likesController.likesPost);


//Post controllers (post y comentarios):
    router.get('/publicaciones', postController.publicaciones);
    router.post('/agregarPublicaciones', upload.single('img'), postController.addPost);
    router.post('/agregarComentarios', postController.addComment);
    

//dashUserControllers:
    router.get('/users/:id', dashUsersController.getUser);
    router.post('/users', dashUsersController.addUser);
    router.put('/users/:id', dashUsersController.editUser);
    //router.delete removido por cuestiones de eficiencia, usar /eliminar/usuario/:id

//dashPostCOntrolles (posts y comentarios):
    router.get('/publicaciones/:id', dashPostControllers.getPost);
    router.put('/publicaciones/:id', dashPostControllers.updatePost);               //No se si sea correcto editar esto
    router.delete('/publicaciones/:id', dashPostControllers.deletePost);

    router.get('/comentarios', dashPostControllers.getComments)
    router.get('/comentarios/:id', dashPostControllers.getComment)
    router.put('/comentarios/:id', dashPostControllers.updateComment)               //No se si sea correcto editar esto
    router.delete('/comentarios/:id', dashPostControllers.deleteComment)



const countRoutes = () => {
    let count = 0;
    router.stack.forEach((middleware) => {
      if (middleware.route) {
        count += 1;
      }
    });
    return count;
  };
  
  console.log(`Total de rutas: ${countRoutes()}`);

module.exports = router;