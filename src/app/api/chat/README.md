/\*
Ejemplo de uso en cualquier page.jsx:
// Anónimo
<ChatWidget />

// Con turista autenticado y personaje
<ChatWidget turistaId={session.user.id} avatarSrc="/xochitl.png" />

// En posición diferente
<ChatWidget position={{ bottom: 16, right: 80 }} />
\*/
