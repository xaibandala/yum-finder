import { Calendar, Plus, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const MealPlanner = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-2">Meal Planner</h1>
        <p className="text-muted-foreground">Plan your weekly meals and generate shopping lists</p>
      </motion.div>

      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Button className="hero-gradient text-white btn-spring">
          <Plus className="w-4 h-4 mr-2" />
          Generate Shopping List
        </Button>
      </motion.div>

      <motion.div 
        className="grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {days.map((day, index) => (
          <motion.div key={day} variants={cardVariants}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-muted/30 py-3">
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {meals.map((meal, mealIndex) => (
                    <motion.div 
                      key={meal} 
                      className="border border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ transitionDelay: `${index * 0.1 + mealIndex * 0.05}s` }}
                    >
                      <div className="text-sm text-muted-foreground mb-2">{meal}</div>
                      <Button variant="ghost" size="sm" className="w-full btn-spring">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Recipe
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State Call to Action */}
      <motion.div 
        className="text-center py-12 mt-8 border border-dashed border-border rounded-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="w-16 h-16 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <ChefHat className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-lg font-semibold mb-2">Start Planning Your Meals</h3>
        <p className="text-muted-foreground mb-4">
          Browse recipes and add them to your weekly meal plan
        </p>
        <Button asChild variant="outline" className="btn-spring">
          <Link to="/search">Browse Recipes</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default MealPlanner;