import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from 'js-cookie';

// Tu función existente para Tailwind
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// NUEVA FUNCIÓN para leer la cookie de información del negocio
const BUSINESS_INFO_COOKIE_NAME = 'businessInfo'; // Define el nombre de la cookie aquí

export const getBusinessInfoFromCookie = () => {
  const savedInfo = Cookies.get(BUSINESS_INFO_COOKIE_NAME);
  if (savedInfo) {
    try {
      return JSON.parse(savedInfo);
    } catch (error) {
      console.error("Error al parsear la información del negocio desde cookies:", error);
      // Si hay un error al parsear, podría significar que la cookie está corrupta,
      // es mejor removerla para evitar problemas futuros.
      Cookies.remove(BUSINESS_INFO_COOKIE_NAME);
      return null;
    }
  }
  return null;
};