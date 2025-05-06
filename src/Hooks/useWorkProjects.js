export const useWorkProjects = () => {
 const getProjectById = async (id) => {
   // Simulação de busca de projeto por ID
   return {
     id,
     title: "Exempelprojekt",
     description: "Detta är ett exempelprojekt.",
     media: [
       { type: "image", src: "/path/to/image1.jpg", alt: "Bild 1" },
       { type: "video", src: "/path/to/video1.mp4", format: "video/mp4" },
     ],
   };
 };

 const getNextProject = (id) => {
   // Simulação de próximo projeto
   return { id: "next-project", title: "Nästa projekt" };
 };

 const getPrevProject = (id) => {
   // Simulação de projeto anterior
   return { id: "prev-project", title: "Föregående projekt" };
 };

 return { getProjectById, getNextProject, getPrevProject };
};