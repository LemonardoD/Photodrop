import mysql from "mysql2/promise";

export const poolConnection = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "david35221311972",
    database: "framology",
});

export async function handler(event) {
    const key = event.Records[0].s3.object.key;
    const id = event.Records[0].s3.object.key.split("!!");
    await poolConnection.execute(
        `UPDATE users SET selfiepath = 'https://framology-image.s3.us-east-2.amazonaws.com/${key}' WHERE id = '${id[0]}'`
    );
    let phone = await poolConnection.execute(`SELECT phone FROM users WHERE id = '${id}'`);
    await poolConnection.execute(
        `INSERT INTO userimages (phone, photopath) VALUES ('${phone[0][0].phone}', 'https://framology-image.s3.us-east-2.amazonaws.com/${key}')`
    );
    console.log("Yes");
    poolConnection.end();
}
