# GET /login

Description
Endpoint untuk mendapatkan semua data user yang tersimpan di dalam database.

HTTP Request
GET http://localhost:3000/login

Response
Status Code: 200 OK
Response Body: accessToken

# GET /users

Description
Endpoint untuk mendapatkan semua data user yang tersimpan di dalam database.

HTTP Request
GET http://localhost:3000/users

Response
Status Code: 200 OK
Response Body: JSON array yang berisi data seluruh user yang tersimpan di dalam database.

# POST /users

Description
Endpoint untuk menambahkan user baru ke dalam database.

HTTP Request
POST http://localhost:3000/users

Request Body
JSON object yang berisi data user yang akan ditambahkan ke dalam database. Berikut adalah contoh request body:

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "role": "admin"
}
```

Response
Status Code: 201 Created
Response Body: JSON object yang berisi data user yang baru saja ditambahkan ke dalam database.

# GET /users/:id

Description
Endpoint untuk mendapatkan data user dengan ID tertentu.

HTTP Request
GET http://localhost:3000/users/:id

URL Parameter
id (integer) : ID dari user yang akan dicari.
Response
Status Code: 200 OK
Response Body: JSON object yang berisi data dari user yang memiliki ID yang sesuai dengan parameter id.

# PUT /users/:id

Description
Endpoint untuk mengubah data user dengan ID tertentu.

HTTP Request
PUT http://localhost:3000/users/:id

URL Parameter
id (integer) : ID dari user yang akan diubah.
Request Body
JSON object yang berisi data baru untuk user yang akan diubah. Berikut adalah contoh request body:

```json
{
  "name": "Jane Doe",
  "email": "janedoe@example.com",
  "password": "newpassword123",
  "role": "admin"
}
```

Response
Status Code: 200 OK
Response Body: JSON object yang berisi data user yang telah diubah.

#DELETE /users/:id
Description
Endpoint untuk menghapus data user dengan ID tertentu.

HTTP Request
DELETE http://localhost:3000/users/:id

URL Parameter
id (integer) : ID dari user yang akan dihapus.
Response
Status Code: 204 No Content
Response Body: Tidak ada response body yang dihasilkan.

# GET /users/:id/products/:productId

Description
Endpoint untuk membeli produk dengan mengurangi stock melalui transaksi.

HTTP Request
GET http://localhost:3000/users/:id/products/:productId

URL Parameter
id (integer) : ID dari user yang akan melakukan pembelian.
productId (integer) : ID dari produk yang akan dibeli.
Request Body
JSON object yang berisi data pembelian. Berikut adalah contoh request body:

```json
{
  "quantity": 1
}
```

Response
Status Code: 200 OK
Response Body: JSON object yang berisi pesan sukses jika pembelian berhasil dilakukan.

# GET /products

Description
Endpoint untuk menampilkan seluruh data produk.

HTTP Request
GET http://localhost:3000/products

Response
Status Code: 200 OK
Response Body: JSON object yang berisi data seluruh produk.

# GET /products/:id

Description
Endpoint untuk menambahkan stock pada produk dengan ID tertentu.

HTTP Request
GET http://localhost:3000/products/:id

URL Parameter
id (integer) : ID dari produk yang akan diupdate.

Request Body
JSON object yang berisi data penambahan stock. Berikut adalah contoh request body:

json
Copy code
{
"quantity": 10
}

Response
Status Code: 200 OK
Response Body: JSON object yang berisi pesan sukses jika penambahan stock berhasil dilakukan.
