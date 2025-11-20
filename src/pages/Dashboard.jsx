import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <p className='mt-4'>Bienvenido, {user?.name}</p>
      <h1></h1>
    </div>
  );
};

export default Dashboard;
