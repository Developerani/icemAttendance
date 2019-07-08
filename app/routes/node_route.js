// var ObjectID = require('mongodb').ObjectID
// npm run dev
var JSAlert = require("js-alert");
var rn = require('random-number');
var Promise = require('promise');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/attendance";
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/attendance");
var data='';
var db_name_new ='';
var db_name_old ='';
var b='';
var a='';
module.exports=function(app,db){

   
    
    app.get('/tp',(req,res)=>{
        
var tp_real_db = new Schema({
    roll_no:{type: String, required: true},
    name:String,
    clg_id:String,
    dept:String,
    year:String,
    div:String
},{collection: db_name_old})//'db_name_old'
var tp_temp_db = new Schema({
    roll_no:{type: String, required: true},
    clg_id:String
},{collection:db_name_new})//db_name_new
var tp_name1 = mongoose.model('tp_name1',tp_real_db)
var tp_name = mongoose.model('tp_name',tp_temp_db)    
var arr=[];
var temp=[];
var arrp = [];
var arra = [];
var cursor = tp_name.find({}).cursor();
cursor.on('data', function(doc) {
  arr.push(doc.roll_no); 
 
});
cursor.on('close', function() {
            var cursor1 = tp_name1.find({}).cursor();
            cursor1.on('data', function(doc) {
            temp.push(doc.roll_no);
            });
            cursor1.on('close', function() {
                console.log(arr);
                console.log(temp);
                display(arr,temp);
                delete mongoose.connection.models['tp_name1'];
                delete mongoose.connection.models['tp_name'];
            });
});


function display(temp,arr)
{
              
    for(var i=0;i<arr.length;i++)
              {
                  var roll=arr[i];
                //   var name = name[i];
                  var flag=0;
                  for(var j=0;j<temp.length;j++)
                  {
                      if(roll==temp[j])
                      {
                          arrp.push(roll);
                          console.log("pushing "+ roll)
                        //   namep.push(name);
                          flag++;
                          break;
                      }
                      
                  }
                  console.log("broke")
                  if(flag==0)
                      {
                          arra.push(roll);
                        //   namea.push(name);
                      }
              }
              console.log("Present "+arrp);
              console.log("Absent "+arra);
             console.log("after storing")
        res.render("tp",{present:arrp,absent:arra});
}
  
    })

    app.post('/register',(req,res)=>{
        const reg=req.body;
        var att = db_select(reg.Department,reg.year,reg.batch)
        
         data = {
            roll_no:reg.roll_no,
            name:reg.name,
            clg_id:reg.Collegeid,
            dept:reg.Department,
            year:reg.year,
            div:reg.batch
        }

        
            db.collection(att).insertOne(data, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });
          
    })

    app.post('/attendance',(req,res)=>{
        const reg=req.body;
        console.log(reg);
       var roh = req.body.Lecture
       console.log(roh);
       var spl= roh.split("|");
       var department = spl[1];
       var year = spl[2];
       var division = spl[3];
       console.log("in attendence")
       var att = department+year+division;
       db_name_new = att;
       db_name_old = db_select(department,year,division);
       console.log(db_name_new,db_name_old)
     console.log(att);
        console.log(JSON.stringify(req.body));
        
         data = {
            roll_no:reg.roll_no,
            clg_id:reg.Collegeid,
        }
       

            db.collection(att).insertOne(data, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
              });
    
        
    })
    
    function db_select(dept,yr,div)
    {
        var db_name = "";
        console.log(dept);
        if(dept == "Computer")
        {
            db_name=db_name + "10";
        }
        else if(dept == "Civil")
        {
            db_name=db_name + "30";
        }
        else if(dept == "Mechanical")
        {
            db_name=db_name + "20";
        }
        else if(dept == "E&TC")
        {
            db_name=db_name + "40";
        }
        if(yr == "SE")
        {
            db_name = db_name + "2";
        }
        else if(yr == "TE")
        {
            db_name = db_name + "3";
        }     
        else if(yr == "BE")
        {
            db_name = db_name + "4";
        }  
        if(div == "Div-1")
        {
            db_name = db_name + "1";
        }      
        else if(div == "Div-2")
        {
            db_name = db_name + "2";
        } 
     return db_name;    
        }

    app.post('/stud_info',(req,res)=>{
        var s = req.body;
        s = JSON.stringify(s)
       
            var s1 = s.split(",");
     
       
        for(var i=0;i<s1.length ; i++)
        {
            s1[i] = s1[i].split(":");
            console.log(s1[i]);
            data = {
                data : s1[i]
            }
            db.collection("FinalAtt").insertOne(data, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
              });
        }
        console.log(s1);
       
        // data = {
        //     roll_no:reg.roll_no,
        //     clg_id:reg.Collegeid,
        // }
       

        //     db.collection("Final").insertOne(data, function(err, res) {
        //         if (err) throw err;
        //         console.log("1 document inserted");
        //       });\

 res.redirect('/');
    })

    app.get('/',(req,res,next)=>{
        // res.status(200).sendFile(__dirname + '/tpp.html');
        res.render('login');
        
    })

    app.get('/index',(req,res)=>{
        res.render('index');
    })

    app.get('/data',(req,res)=>{
        // res.status(200).sendFile(__dirname + '/qr.html');
        
        res.render('qr',{data:data});
    })
    
    app.post('/data',(req,res)=>{
        // console.log('dept '+req.body.dept);
        // console.log('class '+req.body.classs);
        // console.log('div '+req.body.Div);
        // console.log('lec '+req.body.lect);
        
        
        data = req.body.dept +'|'+ req.body.classs+'|'+ req.body.Div+'|' + req.body.lect;
        var spl= data.split("|");
       var department = spl[0];
       var year = spl[1];
       var division = spl[2];
    //    let data_store =new Promise(
        // UserData.find()
        // .then(function(doc){
        //     console.log("UserData");
        // });
        //   db_select(department,year,division);
        //    display(a,b);
    //    data_store.then(display(a,b)) 
      
       // console.log(data);
        res.redirect('/data');
        res.end();
    })

    app.post('/login',(req,res)=>{
        const data=req.body.password;
       // console.log(typeof(data));
       // console.log(data);
        const detail = {"id": data};
        db.collection('staff').findOne(detail,(err,result)=>{
            if(result == null){
                JSAlert.alert('Credentials wrong');
             }else if (result.id == data){
             res.redirect('/index');
           } else {
            JSAlert.alert("Credentials wrong");
           }
        })
        
    })
    
}