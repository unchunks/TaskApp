import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Typography } from '@mui/material';
import './App.css';
import { compressImage } from './utils/imageUtils'; // Import compressImage
import ThemeSelector from './components/ThemeSelector';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import ImageModal from './components/ImageModal';
import EditTodoModal from './components/EditTodoModal';
import CameraModal from './components/CameraModal';
import SortControl from './components/SortControl';
import useLocalStorage from './hooks/useLocalStorage';
import { checkDueDates } from './utils/notificationUtils';
import { sortTodos } from './utils/todoUtils';
import { themes } from './theme';
import TabbedView from './components/TabbedView';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem('groups');
    return savedGroups ? JSON.parse(savedGroups) : [];
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [sortBy, setSortBy] = useState(() => {
    const savedSortBy = localStorage.getItem('sortBy');
    return savedSortBy || 'created';
  });
  const [sortOrder, setSortOrder] = useState(() => {
    const savedSortOrder = localStorage.getItem('sortOrder');
    return savedSortOrder || 'desc';
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  // 初回マウント時に通知許可をリクエストする
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // タスクの期限チェックを1分ごとに実行（通知のため）
  useEffect(() => {
    const interval = setInterval(() => {
      if (Notification.permission === 'granted') { // Only check if permission is granted
        const notifiedIds = checkDueDates(todos);
        if (notifiedIds && notifiedIds.length > 0) {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              notifiedIds.includes(todo.id)
                ? { ...todo, overdueNotified: true }
                : todo
            )
          );
        }
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todos, setTodos]); // setTodos from useLocalStorage should be stable

  const addTodo = (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      images: todo.images || [], // Ensure images array exists
    };
    setTodos([...todos, newTodo]);
  };

  const addGroup = (group) => {
    const newGroup = {
      ...group,
      id: Date.now(),
    };
    setGroups([...groups, newGroup]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleCameraCapture = (imageData) => {
    if (editingTodo) {
      const updatedTodo = {
        ...editingTodo,
        images: [...(editingTodo.images || []), imageData],
      };
      setTodos(
        todos.map((todo) => (todo.id === editingTodo.id ? updatedTodo : todo))
      );
      setEditingTodo(null);
    } else {
      setSelectedImage(imageData);
    }
    setShowCamera(false);
  };

  const filteredTodos = todos.filter((todo) => {
    if (currentTab === 'active') return !todo.completed;
    if (currentTab === 'completed') return todo.completed;
    if (currentTab === 'all') return true;
    return todo.groupId === currentTab;
  });

  const sortedTodos = sortTodos(filteredTodos, sortBy, sortOrder);

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            TODOアプリ
          </Typography>
          <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        </Box>

        <TodoForm
          addTodo={addTodo}
          groups={groups}
          addGroup={addGroup}
          setShowCamera={setShowCamera}
          openImageModal={openImageModal}
        />

        <Box sx={{ mb: 2 }}>
          <TabbedView
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            groups={groups}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <SortControl
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <TodoList
            todos={sortedTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={setEditingTodo}
            groups={groups}
            openImageModal={openImageModal}
          />
        </Box>

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={closeImageModal}
          />
        )}

        {editingTodo && (
          <EditTodoModal
            todo={editingTodo}
            onClose={() => setEditingTodo(null)}
            onSubmit={(updatedTodo) => {
              const updatedTodos = todos.map((todo) =>
                todo.id === updatedTodo.id ? updatedTodo : todo
              );
              setTodos(updatedTodos);
              setEditingTodo(null);
            }}
            groups={groups}
            addGroup={addGroup}
          />
        )}

        {showCamera && (
          <CameraModal
            onClose={() => setShowCamera(false)}
            onCapture={handleCameraCapture}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
