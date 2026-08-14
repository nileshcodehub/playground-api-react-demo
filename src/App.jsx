import { Routes, Route } from 'react-router';
import Layout from '@/layouts/Layout';
import MainPage from '@/pages/MainPage';
import UsersPage from '@/pages/UsersPage';
import PostsPage from '@/pages/PostsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/posts" element={<PostsPage />} />
        {/* <Route path="/comments" element={<MainPage />} />
        <Route path="/todos" element={<MainPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
