
const myexpress = require('express')

const myapp = myexpress()
// solicita el body-parser
var bodyParser = require('body-parser');
myapp.use(bodyParser.urlencoded({extended: true}));
myapp.use(myexpress.static(__dirname + "/static"));
myapp.set('views', __dirname + '/views'); 
myapp.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/foro_db', {useNewUrlParser: true});


//comentario

const UserSchema2 = new mongoose.Schema({
    nombre:  {type: String, require: [true, 'nombre obligatorio']},
    mensaje: {type: String, require: [true, 'comentario obligatorio']},
   
})
//mensaje
const UserSchema = new mongoose.Schema({
    nombre:  {type: String, require: [true, 'nombre obligatorio']},
    mensaje: {type: String, require: [true, 'comentario obligatorio']},
    comentario :[UserSchema2]
//
})


   // crea un objeto que contenga métodos para que Mongoose interactúe con MongoDB
   const Mensaje = mongoose.model('Mensaje', UserSchema); // se crea la coleccion, siempre va en singular y mongoose se crea en plura
   const Comentario = mongoose.model('Comentario',UserSchema2)

myapp.get('/foro', (request, response) => {
    Mensaje.find()
    .then(mensaje  => { 
      
        {response.render("foro", {mensajes: mensaje})} 
    })
    .catch(err => response.json(err));
})


myapp.post('/foro', function(request, response) {
   
    const {introducir_nombre_padre, introducir_mensaje} = request.body
    const mensaje = new Mensaje();
    mensaje.nombre = introducir_nombre_padre
    mensaje.mensaje = introducir_mensaje
   
    mensaje.save() //hace inser
    .then(
        Mensaje.find()
        .then(mensaje  => { 
            {response.render("foro", {mensajes: mensaje})} 
        })
        .catch(err => response.json(err))
    )
    
    .catch(
        (error) =>{ console.log(error)
        },
    )
})




myapp.post('/comentario', function(request, response) {
   

    Comentario.create({nombre: request.body.introducir_nombre_come, mensaje: request.body.introducir_comentario}, function(err, _comentario){

        if(err){
            console.log("error")
        }
        else {
            
                Mensaje.findOneAndUpdate({_id: request.body.id}, {$push: {comentario: _comentario}}, function(err, _mensaje){
                    if(err){
                        // gestiona el error del intento de actualizar al usuario
                        console.log("error2",err)
                    }
                    else {
                        // ¡funcionó! ¿Deberíamos celebrar?
                        console.log("comentario agregado")
                        Mensaje.find()
                        .then(mensaje  => { 
                            {response.render("foro", {mensajes: mensaje})} 
                        })
                        .catch(err => response.json(err))
                    }
                })
            }
    })    
    
    

})



myapp.listen(8000, function() {
    console.log('servidor ejecutandose en  http://localhost:8000'); 
});
