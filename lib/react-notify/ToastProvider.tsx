"use client"

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({children}: ToastProviderProps){
  return (
    <>
      {children}
      <ToastContainer/>
    </>
  )
}