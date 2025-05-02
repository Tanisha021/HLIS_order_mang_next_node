const crypto = require("crypto");
const algorithm = 'AES-256-CBC';
const key = Buffer.from("4fa3c5b6f6a8318be1e0f1e342a1c2a9569f85f74f4dbf37e70ac925ca78e147", 'hex');
const iv = Buffer.from("15a8f725eab7c3d34cc4e1a6e8aa1f9a", 'hex');

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const encrypted = encrypt(`
 {
  "product_name": "Batman Action Figure",
  "product_price": 1499,
  "product_description": "High-quality collectible Batman action figure.",
  "category_id": 2,
  "image_link": "https://example.com/images/batman-figure.jpg"
}



  `);
  const decrypted = decrypt("f7c448ea191861b183bc830c6a482ea7ede95bea7261bb47dbf2c5ce2889fbe24d3b455ea9508d79ef6600ac6bab9039fbcab0c3644cd710608765d056577559ec2e4962839e3fc8492621ad0d4441e9044cd44eb56e2568075520766af630c0b60af93ae28c3536ecd3caf8ea04e7fbc6eb3703460843457ebf6aa6c88fbe00546aaca802f5533551f0678f6aec4e9d33a50a1b3fcf310ceb47e3b675183a771fe535ed230390513a9ea822fc86e2bb45430b805452cb55ad6bd6c4b290bd89fb6309fc92b37331736dd76dc51deacaff83a86d94dfca5d900bcc0ef5ea9dbee26f42f8bfe1e43fc449a3b298565dc8cea38b36c36e12369ae30c85d96aecffec0a49a4ad7cd0c9279c0e210ba1990801265eaa2380dfdc1298b71782db694f");
  
  console.log('Encrypted:', encrypted);
  console.log('Decrypted:', decrypted);
  
  /*
  {
  "page": 1,
  "price_range": [20000, 80000]
}
  {
    "payment_type": "cod",
    "address_id": 1
}
    {
  "address_line": "123, Park Avenue",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "country": "India",
  "pincode": "380015"
}

  
   {
    "email_id": "tan8@example.com",
    "password_": "password1"
  }
// {
//   "full_name": "abc",
//   "email_id": "tan8@example.com",
//   "phone_number": "1524567801",
//   "code_id": 1,
//   "password_": "password1",
//   "device_token": "xyz123",
//   "device_type": "Android",
//   "time_zone": "Asia/Kolkata",
//   "os_version": "13.0",
//   "app_version": "2.1.5",
//   "verify_with":"m"
// }


 {
  "phone_number": "1524567801",
  "otp": "6830"
}
*/