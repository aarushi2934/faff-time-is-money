import React, { useState, useMemo, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Filters } from './components/Filters';
import { TaskGrid } from './components/TaskGrid';
import { StickyCart } from './components/StickyCart';
import { CheckoutPopup } from './components/CheckoutPopup';
import { BackToTop } from './components/BackToTop';
import { Toast } from './components/Toast';
import { allTasksPromise, getTopTasks, categoryFilters, Task } from './data/taskService';
import { UserStatus } from './data/config';
import { CartState, CartItem } from './types';

function App() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalTimeInMinutes: 0
  });

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load tasks on component mount
  useEffect(() => {
    allTasksPromise.then(tasks => {
      setAllTasks(tasks);
    }).catch(error => {
      console.error('Failed to load tasks:', error);
    });
  }, []);

  // Add scroll listener to detect when user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartSavingClick = () => {
    // Smooth scroll to filters section (70vh from top)
    window.scrollTo({
      top: window.innerHeight * 0.7,
      behavior: 'smooth'
    });
  };

  const addToCart = (task: Task) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.task.id === task.id);

      let newItems: CartItem[];
      let toastMessage: string;

      if (existingItem) {
        // Remove the item from cart if it already exists
        newItems = prevCart.items.filter(item => item.task.id !== task.id);
        toastMessage = `${task.title} removed from cart`;
      } else {
        // Add the item to cart with quantity 1
        newItems = [...prevCart.items, { task, quantity: 1 }];
        toastMessage = `${task.title} added to cart`;
      }

      // Show toast notification
      setToast({ show: true, message: toastMessage });

      const totalTimeInMinutes = newItems.reduce(
        (total, item) => total + item.task.timeInMinutes,
        0
      );

      return {
        items: newItems,
        totalTimeInMinutes
      };
    });
  };

  const handleStatusChange = (status: string) => {
    // Only allow one status selection at a time
    setSelectedStatus([status]);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredTasks = useMemo(() => {
    // Use the new getTopTasks function with the specified algorithm
    const userStatus = selectedStatus.length > 0 ? selectedStatus[0] as UserStatus : '' as UserStatus;
    const userTags = selectedCategories;

    return getTopTasks(allTasks, userStatus, userTags);
  }, [selectedStatus, selectedCategories, allTasks]);

  const regularTasks = filteredTasks.filter(task =>
    !task.id.startsWith('featured-')
  );

  return (
    <div className="min-h-screen bg-[#F6F8F5] font-['Inter',sans-serif] relative">
      <Hero
        onCheckoutClick={() => setShowCheckout(true)}
        onStartSavingClick={handleStartSavingClick}
      />

      {/* Content that scrolls over the fixed hero */}
      <div className="relative z-10 mt-[70vh] max-md:mt-0">
        <Filters
          selectedStatus={selectedStatus}
          selectedCategories={selectedCategories}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
        />

        <TaskGrid
          tasks={regularTasks}
          onAddToCart={addToCart}
          cartItems={cart.items.map(item => item.task.id)}
        />
      </div>

      <StickyCart
        cart={cart}
        onCheckoutClick={() => setShowCheckout(true)}
        isScrolled={isScrolled}
      />

      <BackToTop isVisible={isScrolled} />

      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />

      <CheckoutPopup
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
      />
    </div>
  );
}

export default App;
