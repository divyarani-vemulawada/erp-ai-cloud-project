import { Toaster as Sonner } from "sonner";

export const Toaster = () => {
  return (
    <Sonner
      position="top-center"
      expand={false}
      richColors
      // closeButton
      // className="amdox-toaster"
      // toastOptions={{
      //   style: {
      //     background: 'rgba(255, 255, 255, 0.85)',
      //     backdropFilter: 'blur(16px)',
      //     WebkitBackdropFilter: 'blur(16px)',
      //     border: '1px solid rgba(99, 102, 241, 0.2)',
      //     borderRadius: '16px',
      //     boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.15)',
      //     color: '#1e293b',
      //     fontFamily: "'Inter', sans-serif",
      //     fontSize: '14px',
      //     fontWeight: 500,
      //   },
      // }}
    />
  );
};

export default Toaster;
