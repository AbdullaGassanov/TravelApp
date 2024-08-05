import fs from 'fs/promises';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const users = JSON.parse(
  await fs.readFile(`${__dirname}/../dev-data/data/users.json`, 'utf-8')
);

export const getAllUsers = async (req, res) => {
  const usersData = users;

  res.status(200).json({
    status: 'OK',
    lengthL: usersData.length,
    message: {
      users: usersData,
    },
  });
};

export const createUser = async (req, res) => {
  const userInfo = req.body;

  const id = users.length + '_' + new Date().toISOString();

  const newUser = { id, ...userInfo };

  users.push(newUser);

  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users)
  );

  res.status(200).json({
    satus: 'success',
    data: {
      id,
      newUser,
      message: 'User created',
    },
  });
};

export const getUser = async (req, res) => {
  const id = req.params.id;

  const user = users.find((user) => user._id === id);

  if (!user)
    return res
      .status(404)
      .json({ stattus: 'Error', message: 'User not found. Invalid ID' });

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const reqUser = req.body;
  const user = users.find((user) => user._id === id);

  if (!user)
    return res
      .status(404)
      .json({ status: 'Error', message: 'User not found for update' });

  for (let [key, value] of Object.entries(reqUser)) {
    user[key] = value;
  }

  console.log(user);

  users[user._id] = user;

  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users)
  );

  res.status(200).json({
    status: 'success',
    message: {
      user,
    },
  });
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const user = users.find((user) => user._id === id);

  if (!user)
    return res
      .status(404)
      .json({ status: 'Error', message: 'User not found for update' });

  users.splice(users.indexOf(user), 1);

  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users)
  );

  res.status(200).json({
    status: 'success',
    message: {
      info: 'User successfully deleted',
      user,
    },
  });
};
