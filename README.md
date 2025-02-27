Clínica OnLine
![fondo-clinic](https://github.com/Marisolterancocoramon1991/clinica-kervin/assets/108747980/d6ffaa44-3465-4774-a9cf-c012474b9c67)

Descripción de la Clínica
La Clínica OnLine es una institución especializada en salud, equipada con seis consultorios, dos laboratorios y una sala de espera general. Operamos de lunes a viernes de 8:00 a 19:00 y los sábados de 8:00 a 14:00. La clínica cuenta con profesionales de diversas especialidades que atienden a los pacientes según su disponibilidad. Los turnos para consultas o tratamientos se solicitan a través de la web, eligiendo al profesional o la especialidad. La duración mínima de un turno es de 30 minutos, aunque puede variar según la especialidad del profesional. Además, la clínica tiene un sector dedicado a la organización y administración.

Requerimientos de la Aplicación
Sprint 1
Funcionalidades
Página de bienvenida:

Accesos al login y registro del sistema.
Registro:

Registro de Pacientes y Especialistas.
Datos para Pacientes:
Nombre, Apellido, Edad, DNI, Obra Social, Mail, Password, 2 imágenes para perfil.
Datos para Especialistas:
Nombre, Apellido, Edad, DNI, Especialidad (posibilidad de agregar), Mail, Password, Imagen de perfil.
Validación de campos.
Login:

Acceso al sistema con botones de acceso rápido.
Especialistas solo pueden ingresar si un administrador aprueba su cuenta y verifican su mail.
Pacientes solo pueden ingresar si verifican su mail.
Sección Usuarios (solo para Administradores):

Ver información de usuarios, habilitar o inhabilitar acceso para Especialistas.
Generar nuevos usuarios (incluyendo Administradores) con los mismos requerimientos del registro.
Datos para Administradores: Nombre, Apellido, Edad, DNI, Mail, Password, Imagen para perfil.
Sprint 2
Funcionalidades
Mis Turnos:

Como Paciente:

Mostrar turnos solicitados por el paciente.
Filtros por Especialidad y Especialista (sin comboboxes).
Acciones:
Cancelar turno (si no fue realizado) con comentario.
Ver reseña (si existe).
Completar encuesta (si el especialista marcó el turno como realizado y dejó una reseña).
Calificar atención (una vez realizado el turno).
Mostrar estado del turno y acción disponible.
Como Especialista:

Mostrar turnos asignados al especialista.
Filtros por Especialidad y Paciente (sin comboboxes).
Acciones:
Cancelar turno (si no fue Realizado o Rechazado) con comentario.
Rechazar turno (si no fue Aceptado, Realizado o Cancelado) con comentario.
Aceptar turno (si no fue Realizado, Cancelado o Rechazado).
Finalizar turno (si fue Aceptado) con reseña o comentario de la consulta y diagnóstico.
Ver reseña (si existe).
Mostrar estado del turno y acción disponible.
Turnos (para Administradores):

Mostrar turnos de la clínica.
Filtros por Especialidad y Especialista (sin comboboxes).
Acciones:
Cancelar turno (si no fue Aceptado, Realizado o Rechazado) con comentario.
Solicitar Turno (para Pacientes y Administradores):

Selección de Especialidad, Especialista, Día y horario del turno (dentro de los próximos 15 días, según disponibilidad del especialista, sin datepicker).
Administradores deben marcar al Paciente.
Mi Perfil:

Datos del usuario: Nombre, Apellido, Imágenes, etc.
Mis horarios (solo para Especialistas):
Marcar disponibilidad horaria (considerando múltiples especialidades).
Requerimientos mínimos:

Captcha (Google o propio) en el registro de usuarios.
Explicación en README sobre la clínica, pantallas, accesos y contenido de cada sección.
Sprint 3
Funcionalidades
Historia Clínica:

Carga de atenciones y controles para cada paciente.
Visibilidad desde:
Mi Perfil (para Pacientes).
Sección Usuarios (para Administradores).
Sección Pacientes (para Especialistas que hayan atendido al menos una vez al paciente).
Datos de la historia clínica:
Altura, Peso, Temperatura, Presión.
Máximo tres datos dinámicos (clave y valor).
Mejoras en Filtros de Turnos:

Buscar por cualquier campo del turno, incluyendo la historia clínica.
Implementación en la sección Mis Turnos (para Especialistas y Pacientes).
Descargas:

Excel con datos de usuarios (para Administradores).
PDF con la historia clínica (para Pacientes), con logo de la clínica, título del informe y fecha de emisión.
Animaciones:

Al menos 2 animaciones de transición entre componentes al navegar.
Sprint 4
Funcionalidades
Gráficos y Estadísticas (para Administradores):

Log de ingresos al sistema (usuario, día y horario).
Cantidad de turnos por especialidad, por día, solicitados y finalizados por médico en un lapso de tiempo.
Descarga de gráficos e informes en Excel o PDF.
Requerimientos mínimos:

Implementación de 3 pipes y 3 directivas.
Tecnologías Utilizadas
Frontend: Angular
Backend: Firebase
Autenticación: Firebase Authentication
Base de Datos: Firestore
Estilos: Predominantemente blanco y azul, con uso de SweetAlert2 (Swal) para alertas y mensajes.
Componentes: Temática hospitalaria moderna, predominando el color verde en nuevos componentes o diseños.

Uso de la Aplicación
Página de bienvenida: Accesos a login y registro.
Registro: Registro de Pacientes y Especialistas con validación de campos.
Login: Ingreso al sistema con verificación de cuenta para Especialistas y Pacientes.
Sección Usuarios: Administradores pueden ver y gestionar usuarios.
Mis Turnos: Gestión de turnos para Pacientes y Especialistas con filtros y acciones correspondientes.
Solicitar Turno: Pacientes y Administradores pueden solicitar turnos.
Mi Perfil: Información del usuario y gestión de horarios para Especialistas.
Historia Clínica: Carga y visualización de historia clínica.
Gráficos y Estadísticas: Informes para Administradores con opciones de descarga.
Captcha
Implementación de Captcha en el registro de usuarios para mayor seguridad.

![Logo de la Clínica](logo_clinica.jpg)