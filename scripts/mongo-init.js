db.createUser({
  user: "user_dev",
  pwd: "e35GFStKhwK",
  roles: [
    {
      role: "readWrite",
      db: "nextia",
    },
  ],
});
