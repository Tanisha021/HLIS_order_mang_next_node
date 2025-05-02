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
  "page": 1,
  "price_range": [20000, 80000]
}

  
  `);
  const decrypted = decrypt("f7c448ea191861b183bc830c6a482ea7e24757212d325613c23987a4e9b8d49948a61e275448d1106d6237dd6b79e1eaaafb1ce1d95ecabaf15ac85fb2838e7a0369474fc1889e87dd189692a9945ddaf8c977b16795d7f852ce298e2ff6a220bc4a8e433c3e94d6beb66c0fc7abb38a53dda98a982f5ac36c43b451b61a911062bfef6e2c5e3e84a6c9de390b1abbe500a9dc7a1b4c1a304a8efba288c67b53a51d53f0bfc6853d133a6d7d208288dfd28dcc28d3aa38c2b20b04fb5ad144e26af7509fbd161d6bb6146967c3ea2637f80b2713a711ca43e4752467f3605153566eb2dbbfbc77255b893681bc659f1d5ab38b2372a6cdddaa0af436299ef6cf077c261abbfc1085f8d99841416bc75ffeadf3a773e50ad7ac9cfd899ed00138ef1b13b21765ae52aa4c43493ed22f86d229665604f024e32d36d4b8aa2208819d6c792881361d79aa6019e8953443ed445b571e7fdfc25a1e28575bf26f0a83338d032a0b97e3f990cf0b0af2081c437bc347d28fa622a51a6db768e8c7af3454f4d27c4112bbb2f9e13de64419c65c4157b49d22b189fbadfe3b8f3d3b6f33a8af086f916b649caaf87b0d7ae83e942de408796e08a0378897e41d3c767c8ba3b25f9a545d02eb4dfc80f3ac6284a0f18e66c901dcff5176eebd2805ed1dab1b41296b7e075b1d5c6cc570b626b55f069a534d207d5ffd6394017766a735cb5a818f13279fd3ab9f9272ccd9e54872e35cbb8e34eb7cce40e6d69eb185ea3771e6aad1547a946fa180af67a876bf7e5194a38209b557a259017a47559d8c3ae5df974817eaacfab9fdd153f632c96d92893f0ad4212fbbe82519412bf13843d50a920fb91a34dde9629a264807b2f3a8a6b5ab9074f33a14e86f245b93f691339114d117e0ff0255f6dcb902e8592bceeae96bc1f8820254ad819e1132304af5e112cd57a449b27140ddee1a5145c65969d8f1fef86aa7b01a11fe2cab7e0d6473205e76a68898fbfca784a3e9710bc2fdb9b6f313943a91f98e5b86f3b740a17df32f295daf79b6cd1e3d50ce9408a2ece0e419add09de37bef70501536e0818a3a404fa259f7a8346f0a5eb307376b4886f73b272b9ed020e3175880bd2502070308feaf5eec3e182299302016c75a63ea1396b1c828cb139fb9afc12161171c628880723230dc94e121e77aa7d036866ef5fa4920e1bccec27d8b24d35c5abb4a23d9d77156ef796a344a22fe26ea9aa4e7f901c18367bff123cc28eedad56dfe619997ace13143e234ec3f5463482a2f5eb6e3adb52af790fbd072120b84dff927393b0b07f30a7bad766e06bf01b62200917ed88a7ae73b486bc03a5b34360b6ea053ede56c92d2d6181d94d7");
  
  console.log('Encrypted:', encrypted);
  console.log('Decrypted:', decrypted);
  
  /*
  
  
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