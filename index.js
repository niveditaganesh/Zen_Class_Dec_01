const express=require('express')
const app=express();
require('dotenv').config();
const cors=require('cors');
const mongodb=require('mongodb')
const mongoClient=mongodb.MongoClient;
const dbURL= 'mongodb+srv://training-db:1zJ0V5Pupo5uvJeM@studentdb.r5lgi.mongodb.net/<dbname>?retryWrites=true&w=majority';
const objectId=mongodb.ObjectID
const port=process.env.PORT ||4000
app.use(express.json());
app.use(cors());
//connection password:: 1zJ0V5Pupo5uvJeM
app.get("/students",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('users').find().toArray();
        res.status(200).json({data})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't get"})
    }
})
app.get("/student/:id",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('users').findOne({_id:objectId(req.params.id)});
        res.status(200).json({data})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Can't get"})
    }
})
app.post("/student-create",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        req.body.is_assign = false;
        let data=await db.collection('users').insertOne(req.body);
        res.status(200).json({"message":"user added"})
        clientInfo.close();
       // console.log(process)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't create"})
    }
})

app.put("/student-update/:id",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('users').findOneAndUpdate({_id:objectId(req.params.id)},{$set:req.body});
        res.status(200).json({
           message:"user updated"})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't update"})
    }
})
app.delete("/student-delete/:id",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('users').deleteOne({_id:objectId(req.params.id)});
        res.status(200).json({
            message:"user deleted"})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't delete"})
    }
})

app.get("/mentors",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('mentors').find().toArray();
        res.status(200).json({data})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't create"})
    }
})
app.get("/mentor/:id",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('mentors').findOne({_id:objectId(req.params.id)});
        res.status(200).json({data})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Can't get"})
    }
})
app.post("/mentor-create",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('mentors').insertOne(req.body);
        res.status(200).json({message:"mentor added"})
        clientInfo.close();
        } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't create"})
    }
})
app.put("/mentor-update/:id",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('mentors')
        .findOneAndUpdate({_id:objectId(req.params.id)},{$set:req.body});
        res.status(200).json({
           message:"mentor updated"})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't update"})
    }
})
app.delete("/mentor-delete/:id",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let data=await db.collection('mentors').deleteOne({_id:objectId(req.params.id)});
        res.status(200).json({
            message:"mentor deleted"})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't delete"})
    }  
})


app.post("/assign-students-and-mentors",async(req,res)=>{
    try {
        let clientInfo = await mongoClient.connect(dbURL);
        let db = clientInfo.db("studentMentor");
        let students_id = [];
        await req.body.students.forEach(async (ele) => {
            students_id.push(objectId(ele));
            await db.collection('users').findOneAndUpdate({
                _id: objectId(ele)
            }, {
                $set: {
                    mentor_id: objectId(req.body.mentorId),
                    is_assign: true
                }
            });
        });
        await db.collection('mentors').findOneAndUpdate({
            _id: objectId(req.body.mentorId)
        }, {
            $set: {
                students: students_id
            }
        });
        res.status(200).json({
            status: "success",
            message: "Students assigned"
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

app.get("/not-assigned-students",async(req,res)=>{
    try {
        let clientInfo = await mongoClient.connect(dbURL);
        let db = clientInfo.db("studentMentor");
        let data = await db.collection('users').find({
            is_assign: false
        }).toArray();
        res.status(200).json({
            data,
            items: data.length
        });
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})


app.get("/students-under-mentor/:id",async(req,res)=>{
    try {
        let clientInfo = await mongoClient.connect(dbURL);
        let db = clientInfo.db("studentMentor");
        let data = await db.collection('mentors').aggregate([{
            $lookup: {
                'from': 'users',
                'localField': 'students',
                'foreignField': '_id',
                'as': 'results'
            }
        }, {
            $project: {
                'results.name': 1
            }
        }, {
            $match: {
                '_id': objectId(req.params.id)
            }
        }]).toArray(); 
        
        console.log(data[0].results.length)
        
        if (data[0].results.length>0) {

            res.status(200).json({
                status: "success",
                data
            });
        } else {
            res.status(200).json({
                status: "failed",
                message: "No students are assigned"
            })
        }
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
app.get("/mentor-for-student/:id",async(req,res)=>{
    try {
        let clientInfo = await mongoClient.connect(dbURL);
        let db = clientInfo.db("studentMentor");
        let data = await db.collection('users').aggregate([{
            $lookup: {
                'from': 'mentors',
                'localField': 'mentor_id',
                'foreignField': '_id',
                'as': 'results'
            }
        }, {
            $project: {
                'results.name': 1
            }
        }, {
            $match: {
                '_id': objectId(req.params.id)
            }
        }]).toArray(); 
        
        console.log(data[0].results.length)
        
        if (data[0].results.length>0) {

            res.status(200).json({
                status: "success",
                data
            });
        } else {
            res.status(200).json({
                status: "failed",
                message: "No mentor is assigned"
            })
        }
        clientInfo.close();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.delete("/delete-assignment/:id",async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentMentor");
        let ment=await db.collection('users').findOne({_id:objectId(req.params.id)});
        let data=await db.collection('users').
        findOneAndUpdate({_id:objectId(req.params.id)},{$set:{mentor_id:"",is_assign:false}});
    
    //    console.log(ment.mentor_id)
        let stud=await db.collection('mentors').findOne({_id:objectId(ment.mentor_id)});
      //  console.log(stud.students)
        let newStud=await stud.students.filter(obj => obj != req.params.id)
        await db.collection('mentors').
        findOneAndUpdate({_id:objectId(ment.mentor_id)},{$set:{students: newStud}});
        res.status(200).json({
           message:"assignment deleted"
        })
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"no assignment made"})
    }  
})


app.listen(port,()=>{
    console.log('Server Started')
})