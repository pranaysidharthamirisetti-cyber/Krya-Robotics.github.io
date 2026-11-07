export default function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.jpeg`}
      alt="KRYA Robotics logo"
      draggable={false}
      className={'block shrink-0 rounded-xl object-cover ring-1 ring-slate-300/70 shadow-sm bg-white ' + className}
    />
  );
}
