export default function ChatLog({chat}) {
  return (
    <div className="chat-log">
      {chat.map(m => (
        <div key={m.id} className="chat-item">#{m.id}: {m.value}</div>
      ))}
    </div>
  )
}
