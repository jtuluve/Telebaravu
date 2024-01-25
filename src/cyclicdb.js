const axios = require("axios")
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("angry-threads-clamCyclicDB")

const users = db.collection("users")
//ping png api
axios.get(`https://tulu-png-api.glitch.me/`);

async function dbupdate(userid, key, values) {
  if (key.length !== values.length) {
    console.log("Key and values length difference error");
    return;
  }

  // Assuming "userdata" is your table name
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  let updateExpression = '';

  for (let i = 0; i < key.length; i++) {
    const attributeKey = `#${key[i]}`;
    const attributeValue = `:${key[i]}`;
    expressionAttributeNames[attributeKey] = key[i];
    expressionAttributeValues[attributeValue] = values[i];
    updateExpression += `${attributeKey} = ${attributeValue},`;
  }

  updateExpression = updateExpression.slice(0, -1);

  try {
    await db.update({
      TableName: 'userdata',
      Key: { userid },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });
  } catch (err) {
    console.log(err);
  }
}

async function dbget(userid) {
  try {
    const result = await db.get({
      TableName: 'userdata',
      Key: { userid },
    });

    return result.Item || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function dbcreate(userid) {
  try {
    await db.put({
      TableName: 'userdata',
      Item: { userid },
      ConditionExpression: 'attribute_not_exists(userid)',
    });
  } catch (err) {
    console.log(err);
  }
}

async function dbdelete(userid) {
  try {
    await db.delete({
      TableName: 'userdata',
      Key: { userid },
    });
  } catch (err) {
    console.log(err);
  }
}


exports.dbcreate = dbcreate;
exports.dbdelete = dbdelete;
exports.dbget = dbget;
exports.dbupdate = dbupdate;
