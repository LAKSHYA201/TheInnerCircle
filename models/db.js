const pool=require('./pool');

async function insertJoineeDetails(username,password,isAdmin){
    let {rows}=await pool.query("SELECT username FROM users;");
    const userExists = rows.some(row=>row.username === username);
    if(userExists){
        throw new Error("Username already exists");
    }
    else{ 
        await pool.query("INSERT INTO users (username,password,membership,is_admin) VALUES ($1,$2,'Joinee',$3)",[username,password,isAdmin]);
    }
}

async function createMessage(title,text,user_id){
    await pool.query("INSERT INTO messages (title,text,user_id) VALUES ($1,$2,$3)",[title,text,user_id]);
}

async function changeMembershipStatus(user_id){
    await pool.query("UPDATE users SET membership='elite' WHERE id=$1",[user_id]);
}
async function deleteMessage(id){
    await pool.query("DELETE FROM messages where id=$1",[id]);
}

module.exports={
    insertJoineeDetails,
    createMessage,
    changeMembershipStatus,
    deleteMessage
}