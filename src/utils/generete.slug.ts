export const  generateSlug=(input: string): string => {
    const slug = input
      .toLowerCase() // Преобразование в нижний регистр
      .replace(/ /g, '-') // Замена пробелов на дефисы
      .replace(/[^\w-]+/g, '') // Удаление всех символов, кроме букв, цифр, дефисов
      .replace(/--+/g, '-'); // Удаление повторяющихся дефисов
  
    return slug;
  }