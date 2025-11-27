import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import ToolsPage from '@/pages/ToolsPage'
import ToolDetailPage from '@/pages/ToolDetailPage'
import {
   NavigationMenu,
   NavigationMenuList,
   NavigationMenuItem,
   navigationMenuTriggerStyle,
} from '@/components/ui'
import { Button } from '@/components/ui'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function App() {
   return (
      <Router>
         <div className="min-h-screen flex flex-col bg-background">
            <nav className="bg-card flex border-b p-4 relative z-50">
               <div className='flex flex-wrap items-center gap-4 max-w-5xl mx-auto w-full'>
                  <Link to="/">
                     <h1 className="text-xl font-semibold">
                        <span className='font-black'>Prompt</span><span className='font-semibold'>Sikho</span>
                     </h1>
                  </Link>
                  <div
                     className='lg:!flex lg:flex-auto lg:ml-12 max-lg:hidden max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50'>
                     <div
                        className="lg:!flex lg:flex-auto max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                        <NavigationMenu>
                           <NavigationMenuList>
                              <NavigationMenuItem>
                                 <Link to="/" className={navigationMenuTriggerStyle()}>Home</Link>
                              </NavigationMenuItem>
                              <NavigationMenuItem>
                                 <Link to="/tools" className={navigationMenuTriggerStyle()}>Tools</Link>
                              </NavigationMenuItem>
                           </NavigationMenuList>
                        </NavigationMenu>
                     </div>
                  </div>
                  <div className='flex items-center ml-auto space-x-6'>
                     <NavigationMenu>
                        <NavigationMenuList>
                           <NavigationMenuItem>
                              <Link to="/" className={navigationMenuTriggerStyle()}>Login</Link>
                           </NavigationMenuItem>
                        </NavigationMenuList>
                     </NavigationMenu>

                     <Button variant="outline" className="lg:hidden h-10 w-10 p-0 rounded-md" aria-label="Open menu">
                        <i className="bi bi-list text-lg" />
                     </Button>
                  </div>
               </div>
            </nav>
            <main className="flex-1 max-w-4xl mx-auto w-full py-8 px-4">
               <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/tools/:toolId" element={<ToolDetailPage />} />
               </Routes>
            </main>
            <footer className="bg-card border-t p-4 text-center text-sm text-muted-foreground">
               © 2025 <span className='font-black'>Prompt</span><span className='font-semibold'>Sikho</span>
            </footer>
         </div>
      </Router>
   )
}
