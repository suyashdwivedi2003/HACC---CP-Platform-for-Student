import admin from "firebase-admin";

const jsondata = {
  type: "service_account",
  project_id: "dj-hacc",
  private_key_id: "26cd7656ce588da6435a4787f5452814d8218567",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCv3/8pcaYOHMwP\nnSuORldV5MB/dFrfIYO/h/kAFvAk86/BFogv/7P5NXT8sbXLGNk+u+dmkrXH77OS\nQxrKzRMxa+HTmjDYAmH6oATDZAHFaWGvQMAD8cV7cEPEnKXvtAunf6XE8yPnBxHn\n4qqVtYJBsubOsYRvisf6hYZ7eHkGTyNC6v/01hW97kCa1wOkZ/b+xUhDp+L25P8I\nzPwhUvTNyTIM96Nc6KcFITJd7K1HjrEKA+An+JVcaXuFU1K0Tc6sxlaP4oeeqM7P\nzAcOlQC5oXb337R2nhrz4gOGV7k+TryssBH3Oun6XZuTJ5d+ZZj83h1ycsP934s0\nHLxEvmdTAgMBAAECggEAK+6Ni9ouKxdJZ9sQPrVWaoe+B/hWHKeAA+9gpQOVz/0p\nGVfaA/dhCu6t/tMbQJS/63o/drFOBBfdqLrnbeIlGbLDkbpR2htaQyMGnZIVGS1W\nL9NCQ5n4hPmJjAq/Lm2wfZIWo+hCPxrWf7BwgP36gBPCsL3KAZzOkEcbTStOO+NN\nfvFNPBmkKYL5yfM66BivjKByIKnWp1hY1Uv6Up7jkEtr1Z7yqPnFAgLmrU1WjM4s\njrI98HNyDc4/ho3okniYhForBwIk7E17dbG1U0140J/K7nskdlxQFER9fVEWNd1t\nLfSwFCfdgXNo58bOo0E8WFAKcoTt7DvOjYZZIl3efQKBgQDjUI73Gval5a0zZPlX\nCNpAOY+yUv20FPnDUqv8EmDZ6j+RiDivKyk2x46Gk0G1jqLwVj/eB4krcdqG59Jp\nZAbBt4MC0kRMTjyCygn/qgafNecWFSTXN1wUE+u3iu9CDo49Gq74bW3sgHbxUZ0o\n5kzcy6y+StewMwIby4kJwoqjVwKBgQDGEaty5KIz4P5X7+zYYXsYQoYJ5K/KzBKf\nTo/o+a7F8uLs1q0bTk2+UuuJyK59DnjnBl48HeVWxYPu9xoTHZOvK7ARKN4rEzXD\neD+ByFQ8x5hDd23vPwrhe8Dhr8I0AcZAmzGRn8HYetUzJauz9Hq6dqJ5+QW+hjoJ\ny9EGzx/6ZQKBgQC/IL0UiFdapgM7c2szAv5/geaQybcH85sN4DU7fThyAcPxWdhP\ncLr2lFQCU06smYHnEp4g0bVEEjbrt3/znWcQ+nvto15Jyn6WecpubUekFm524tBX\nJPUG7LkFWoxRvmtadVUpDNmgQWPBBB5ghUObYqWcWtGAFWNwe3J+AlUPgQKBgE8W\nDxc5I2sDk4sZScC8a6IsLckVfvvCsEzb2ap0x8xSRzm6HjSg93nfMh05/DIC7VOR\nv17RsRkMlLl+APNRA/8Vup+fadZZPUZnZTQ1AS2jpLCLp2G4EmgmOcXjn++UJcz2\nKryyxXviz+40RHL+U2LQq994B0sj3Vi8ASJu4Z3hAoGALn+bD/kDrf0m+/jiaPpC\nl1uCdMpWfQczp6ZiQ2y5YSfvzPq5+xjtI/Mc8kimrPqkteAZ5VoGFivs9/mSXpiS\nQfr9WH57A8z2z4DPwnB8ANaRh9orG70s98au7rTLWJzwE4dThSzWzCvq+ok5+HxQ\n53huNrY6J/iIY8eYZhIxQps=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@dj-hacc.iam.gserviceaccount.com",
  client_id: "100962937180668872036",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40dj-hacc.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(jsondata),
});

export default admin;
