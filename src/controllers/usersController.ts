import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  console.log('Register attempt with email:', email); // Log para verificar el email recibido

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email); // Log cuando el usuario ya existe
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password for registration:', hashedPassword); // Log para verificar el hash de la contraseña

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('User registered successfully:', newUser.email); // Log cuando el usuario se registra con éxito
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error); // Log de error al registrar
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email); // Log para verificar el email recibido

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email); // Log cuando no se encuentra el usuario
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Compare the password entered by the user with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for email:', email); // Log cuando la contraseña no es válida
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    console.log('Login successful for user:', email); // Log cuando el login es exitoso
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error('Error during login for email:', email, error); // Log de error al hacer login
    res.status(500).json({ message: 'Error logging in', error });
  }
};
