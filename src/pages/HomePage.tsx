import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Users, Map, Activity, Brain, Navigation, X, Moon, Sun, Bell, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBot from '../components/ChatBot';

interface HomePageProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'alert' | 'update' | 'info';
  timestamp: string;
  isRead: boolean;
}

function HomePage({ isDarkMode, setIsDarkMode }: HomePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [impactCount, setImpactCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Disaster Alert",
      message: "Flash floods reported in Mumbai region",
      type: "alert",
      timestamp: new Date().toLocaleString(),
      isRead: false
    },
    {
      id: 2,
      title: "Platform Update",
      message: "New emergency response features added",
      type: "update",
      timestamp: new Date().toLocaleString(),
      isRead: false
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  // Animate impact counter
  useEffect(() => {
    const targetCount = 1500; // Example number of people helped
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      if (current < targetCount) {
        current += increment;
        setImpactCount(Math.min(Math.floor(current), targetCount));
      } else {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const HowItWorksContent = () => (
    <div className="space-y-12">
      {/* How It Works Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 dark:text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: <AlertCircle className="h-12 w-12 text-red-600" />,
              title: "Report Incident",
              description: "Report disaster incidents with real-time location data"
            },
            {
              icon: <Brain className="h-12 w-12 text-red-600" />,
              title: "AI Processing",
              description: "Our AI processes & prioritizes reports"
            },
            {
              icon: <Users className="h-12 w-12 text-red-600" />,
              title: "Task Assignment",
              description: "Volunteers & aid agencies get assigned tasks"
            },
            {
              icon: <Activity className="h-12 w-12 text-red-600" />,
              title: "Live Tracking",
              description: "Track relief efforts in real-time"
            }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 dark:text-white">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="h-8 w-8 text-red-600" />,
              title: "Crowdsourced Reports",
              description: "Real-time disaster reporting from the community"
            },
            {
              icon: <Brain className="h-8 w-8 text-red-600" />,
              title: "AI Prediction",
              description: "Advanced AI algorithms for resource allocation"
            },
            {
              icon: <Navigation className="h-8 w-8 text-red-600" />,
              title: "Live Tracking",
              description: "Real-time monitoring of relief operations"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NotificationsPanel = () => {
    const markAllAsRead = () => {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const clearNotifications = () => {
      setNotifications([]);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50"
      >
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold dark:text-white">Notifications</h3>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Mark all as read
              </button>
              <button
                onClick={clearNotifications}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1 rounded-full ${
                    notification.type === 'alert' ? 'bg-red-100 dark:bg-red-900/50' :
                    notification.type === 'update' ? 'bg-green-100 dark:bg-green-900/50' :
                    'bg-blue-100 dark:bg-blue-900/50'
                  }`}>
                    <AlertCircle className={`h-4 w-4 ${
                      notification.type === 'alert' ? 'text-red-600 dark:text-red-400' :
                      notification.type === 'update' ? 'text-green-600 dark:text-green-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium dark:text-white">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    );
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('Notifications Enabled', {
          body: 'You will now receive updates about emergencies and platform updates',
          icon: '/notification-icon.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return (
    <div className={`flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Add notification buttons next to theme toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={notificationPermission === 'default' ? requestNotificationPermission : () => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg relative"
            title={notificationPermission === 'default' ? 'Enable Notifications' : 'Show Notifications'}
          >
            {notificationPermission === 'default' ? (
              <BellRing className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <>
                <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-0 right-0 h-3 w-3 bg-red-600 rounded-full"></span>
                )}
              </>
            )}
          </motion.button>
          <AnimatePresence>
            {showNotifications && notificationPermission === 'granted' && (
              <NotificationsPanel />
            )}
          </AnimatePresence>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? 
            <Sun className="h-6 w-6 text-yellow-500" /> : 
            <Moon className="h-6 w-6 text-gray-700" />
          }
        </motion.button>
      </div>

      {/* Hero Section */}
      <section className="relative bg-red-600 dark:bg-red-800 text-white py-20">
        <div className="absolute inset-0">
          <img
            src="https://media.istockphoto.com/id/589428108/photo/air-rescue-service.jpg?s=612x612&w=0&k=20&c=54AEKaKqWSi48qQcFlVsSL_E9K5DSBoi55hGp4XcE_Q="
            alt="Disaster Relief"
            className="w-full h-full object-cover opacity-80"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 to-red-900/50" /> */}
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto px-4"
        >
          <div className="max-w-3xl backdrop-blur-sm bg-white/8 p-8 rounded-lg">
            <h1 className="text-5xl font-bold mb-6">
              AI-Driven Disaster Relief at Your Fingertips
            </h1>
            <p className="text-xl mb-8">
              Connecting those in need with immediate assistance through advanced AI technology and a network of dedicated volunteers.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/report" className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Report an Emergency
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
                  Join as a Volunteer
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/map" className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
                  Track Relief Operations
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Impact Counter */}
      {/* <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800"
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-2">{impactCount}+</h2>
          <p className="text-xl">People Helped Through Our Platform</p>
        </div>
      </motion.div> */}

      {/* Live Map Preview with glassmorphism */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Live Disaster Map</h2>
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-4 rounded-lg shadow-lg">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12334303.399978595!2d71.7762473924074!3d19.21805959787736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e1!3m2!1sen!2sin!4v1739614004241!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 p-3 rounded-lg shadow-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        <span className="dark:text-white">5 Critical</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="dark:text-white">8 Moderate</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="dark:text-white">3 Low</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to="/map"
                    className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-2 transition-colors"
                  >
                    <Map className="h-4 w-4" />
                    <span>View Full Map</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating How It Works Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 left-8 bg-red-600 dark:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold 
                 shadow-lg hover:bg-red-700 dark:hover:bg-red-800 transition-all duration-300 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        How It Works
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-7xl mx-4 max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
              <HowItWorksContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add ChatBot component */}
      <ChatBot />
    </div>
  );
}

export default HomePage;