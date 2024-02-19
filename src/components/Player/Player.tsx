interface PlayerProps {
  id: string
  onPlay: () => void
}

export default function Player ({ id, onPlay }: PlayerProps): JSX.Element {
  return (
    <audio controls autoPlay={true} onPlay={onPlay}>
      <source src={`https://reacoustic-2fqcvdzp6q-uc.a.run.app/stream?id=${id}`} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  )
}
