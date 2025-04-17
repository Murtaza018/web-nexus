import React, { useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"

// Mock data - in a real app, this would come from a database
const recipes = [
  {
    id: "1",
    title: "Homemade Pizza",
    description: "Classic homemade pizza with a crispy crust and fresh toppings.",
    image: "/images/pizza.jpg",  // Correct path for local images inside the public folder
    prepTime: "20 mins",
    cookTime: "15 mins",
    ingredients: [
      "2 1/2 cups all-purpose flour",
      "1 teaspoon salt",
      "1 teaspoon sugar",
      "1 tablespoon active dry yeast",
      "1 cup warm water",
      "2 tablespoons olive oil",
      "1/2 cup tomato sauce",
      "2 cups shredded mozzarella cheese",
      "Toppings of your choice",
    ],
    instructions: [
      "In a large bowl, combine flour, salt, sugar, and yeast.",
      "Add warm water and olive oil, then mix until a dough forms.",
      "Knead the dough on a floured surface for about 5 minutes.",
      "Place in a greased bowl, cover, and let rise for 30 minutes.",
      "Preheat oven to 450°F (230°C).",
      "Roll out the dough on a floured surface to your desired thickness.",
      "Transfer to a baking sheet or pizza stone.",
      "Spread tomato sauce over the dough, leaving a small border for the crust.",
      "Sprinkle with cheese and add your favorite toppings.",
      "Bake for 12-15 minutes or until the crust is golden and the cheese is bubbly.",
    ],
  },
  {
    id: "2",
    title: "Chocolate Chip Cookies",
    description: "Soft and chewy chocolate chip cookies that are perfect for any occasion.",
    image: "/images/cookies.jpg",  // Correct path for local images inside the public folder
    prepTime: "15 mins",
    cookTime: "10 mins",
    ingredients: [
      "1 cup butter, softened",
      "1 cup white sugar",
      "1 cup packed brown sugar",
      "2 eggs",
      "2 teaspoons vanilla extract",
      "3 cups all-purpose flour",
      "1 teaspoon baking soda",
      "2 teaspoons hot water",
      "1/2 teaspoon salt",
      "2 cups semisweet chocolate chips",
    ],
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "Cream together the butter, white sugar, and brown sugar until smooth.",
      "Beat in the eggs one at a time, then stir in the vanilla.",
      "Dissolve baking soda in hot water. Add to batter along with salt.",
      "Stir in flour and chocolate chips.",
      "Drop by large spoonfuls onto ungreased pans.",
      "Bake for about 10 minutes or until edges are nicely browned.",
    ],
  },
  {
    id: "3",
    title: "Vegetable Stir Fry",
    description: "Quick and healthy vegetable stir fry with a savory sauce.",
    image: "/images/stirfry.jpg",  // Correct path for local images inside the public folder
    prepTime: "10 mins",
    cookTime: "15 mins",
    ingredients: [
      "2 tablespoons vegetable oil",
      "1 onion, sliced",
      "2 bell peppers, sliced",
      "2 carrots, julienned",
      "1 cup broccoli florets",
      "1 cup snap peas",
      "2 cloves garlic, minced",
      "1 tablespoon ginger, minced",
      "3 tablespoons soy sauce",
      "1 tablespoon honey",
      "1 teaspoon sesame oil",
      "1 tablespoon cornstarch mixed with 2 tablespoons water",
    ],
    instructions: [
      "Heat vegetable oil in a large wok or skillet over high heat.",
      "Add onion and stir-fry for 1 minute.",
      "Add bell peppers, carrots, broccoli, and snap peas. Stir-fry for 3-4 minutes.",
      "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
      "In a small bowl, mix soy sauce, honey, and sesame oil.",
      "Pour sauce over vegetables and toss to coat.",
      "Add cornstarch mixture and stir until sauce thickens, about 1 minute.",
      "Serve hot over rice or noodles.",
    ],
  },
];







// Icons to replace lucide icons
const IconButton = ({ children, ...props }) => (
  <button {...props} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
    {children}
  </button>
);

const ClockIcon = () => <span>🕒</span>;
const PlusIcon = () => <span>+</span>;
const PlusCircleIcon = () => <span>⊕</span>;
const TrashIcon = () => <span>🗑️</span>;
const ArrowLeftIcon = () => <span>←</span>;
const PrinterIcon = () => <span>🖨️</span>;
const DownloadIcon = () => <span>⬇️</span>;
const CameraIcon = () => <span>📷</span>;

// Basic UI components
const Button = ({ children, variant = "primary", ...props }) => {
  const style = {
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 500,
    border: variant === "outline" ? '1px solid #ccc' : 'none',
    backgroundColor: variant === "outline" ? 'transparent' : '#387478',
    color: variant === "outline" ? '#333' : 'white',
  };

  return (
    <button style={style} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", ...props }) => {
  const style = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    height: '100%',
    ...props.style
  };

  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "", ...props }) => {
  const style = {
    padding: '16px',
    ...props.style
  };

  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = "", ...props }) => {
  const style = {
    padding: '16px',
    paddingTop: 0,
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#666',
    ...props.style
  };

  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
};

const Input = ({ ...props }) => {
  const style = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };

  return <input style={style} {...props} />;
};

const Label = ({ children, htmlFor, ...props }) => {
  const style = {
    fontWeight: 500,
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <label style={style} htmlFor={htmlFor} {...props}>
      {children}
    </label>
  );
};

const Textarea = ({ ...props }) => {
  const style = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    minHeight: props.className?.includes('min-h-[100px]') ? '100px' : 'auto',
  };

  return <textarea style={style} {...props} />;
};

const Separator = ({ ...props }) => {
  const style = {
    height: '1px',
    width: '100%',
    backgroundColor: '#eaeaea',
    margin: '32px 0',
  };

  return <div style={style} {...props} />;
};

// RecipeCard Component
function RecipeCard({ id, title, description, image, prepTime, cookTime, onRecipeClick }) {
  return (
    <div onClick={() => onRecipeClick(id)} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
      <Card>
        <div style={{
          aspectRatio: '16/9',
          position: 'relative',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        <CardContent>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
          <p style={{ color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        </CardContent>
        <CardFooter>
          <ClockIcon />
          <span style={{ marginLeft: '4px' }}>Prep: {prepTime}</span>
          <span style={{ margin: '0 8px' }}>•</span>
          <span>Cook: {cookTime}</span>
        </CardFooter>
      </Card>
    </div>
  );
}

// Home Page Component
function Home({ onAddRecipeClick, onRecipeClick }) {
  return (
    <div id="home" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>My Recipe Book</h1>
        <Button onClick={onAddRecipeClick}>
          <PlusCircleIcon />
          <span>Add Recipe</span>
        </Button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            description={recipe.description}
            image={recipe.image}
            prepTime={recipe.prepTime}
            cookTime={recipe.cookTime}
            onRecipeClick={onRecipeClick}
          />
        ))}
      </div>
    </div>
  );
}

// Add Recipe Page Component
function AddRecipe({ onBackHome, onRecipeAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [imagePreview, setImagePreview] = useState(null);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleRemoveStep = (index) => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save the recipe data here
    const newRecipe = {
      id: String(Date.now()), // Simple unique ID for now
      title,
      description,
      prepTime,
      cookTime,
      ingredients,
      instructions: steps,
      image: imagePreview,
    };
    recipes.push(newRecipe);
    onRecipeAdded();
    toast.success('Recipe created successfully!')
  };

  return (
    <div id="add-recipe" style={{ maxWidth: '768px', margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '32px' }}>Add New Recipe</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="title">Recipe Title</Label>
              <Input id="title" placeholder="Enter recipe title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe your recipe"
                className="min-h-[100px]"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="prepTime">Preparation Time</Label>
                <Input id="prepTime" placeholder="e.g. 15 mins" required value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Label htmlFor="cookTime">Cooking Time</Label>
                <Input id="cookTime" placeholder="e.g. 30 mins" required value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Label>Ingredients</Label>
              {ingredients.map((ingredient, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRemoveIngredient(index)}
                    style={{ padding: '8px', backgroundColor: "#387478", "&:hover": { backgroundColor: "#2f5f61" }, color: "#fff"  }}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddIngredient} style={{ alignSelf: 'flex-start',  backgroundColor: "#387478", "&:hover": { backgroundColor: "#2f5f61" }, color: "#fff"  }} >
                <PlusIcon />
                <span>Add Ingredient</span>
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Label>Instructions</Label>
              {steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px' }}>
                  <Textarea
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    style={{ padding: '8px', backgroundColor: "#387478", "&:hover": { backgroundColor: "#2f5f61" }, color: "#fff"  }}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddStep} style={{ alignSelf: 'flex-start',  backgroundColor: "#387478", "&:hover": { backgroundColor: "#2f5f61" }, color: "#fff"  }}>
                <PlusIcon />
                <span>Add Step</span>
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="image">Recipe Image</Label>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '24px',
                cursor: 'pointer'
              }}>
                <input type="file" id="image" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                <label htmlFor="image" style={{ cursor: 'pointer', textAlign: 'center' }}>
                  {imagePreview ? (
                    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Recipe preview"
                        style={{ maxHeight: '300px', margin: '0 auto', borderRadius: '8px' }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <CameraIcon />
                      <p style={{ color: '#666', marginTop: '8px' }}>Click to upload an image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px' }}>
              <Button type="button" variant="outline" onClick={onBackHome}>
                Cancel
              </Button>
              <Button type="submit">Save Recipe</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

// Recipe Detail Page Component
function RecipeDetail({ recipeId, onBackHome }) {
  const recipe = recipes.find((r) => r.id === recipeId);
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, you'd generate a PDF here
    // For now, just use print functionality
    handlePrint();
  };

  if (!recipe) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '16px' }}>Recipe not found</h1>
        <Button onClick={onBackHome}>
          <ArrowLeftIcon />
          <span>Back to Recipes</span>
        </Button>
      </div>
    );
  }

  return (
    <div id={`recipe-${recipeId}`} style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Button variant="outline" onClick={onBackHome}>
          <ArrowLeftIcon />
          <span>Back to Recipes</span>
        </Button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon />
            <span>Print</span>
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <DownloadIcon />
            <span>Download</span>
          </Button>
        </div>
      </div>

      <div ref={printRef} style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '16px' }}>{recipe.title}</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>{recipe.description}</p>

          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            position: 'relative',
            marginBottom: '32px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', color: '#666' }}>
            <ClockIcon />
            <span style={{ marginLeft: '8px' }}>Prep: {recipe.prepTime}</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>Cook: {recipe.cookTime}</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <Card style={{ gridColumn: '1 / 2', padding: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Ingredients</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ marginRight: '8px' }}>•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div style={{ gridColumn: '2 / 4' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>Instructions</h2>
              <ol style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} style={{ display: 'flex', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 700, marginRight: '16px' }}>{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <Separator />

          <div style={{ textAlign: 'center', color: '#666' }}>
            <p>My Recipe Book</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const handleAddRecipeClick = () => {
    setCurrentView('add-recipe');
  };

  const handleRecipeClick = (id) => {
    setSelectedRecipeId(id);
    setCurrentView('recipe-detail');
  };

  const handleBackHome = () => {
    setCurrentView('home');
    setSelectedRecipeId(null);
  };

  const handleRecipeAdded = () => {
    setCurrentView('home');
  };

  switch (currentView) {
    case 'home':
      return <Home onAddRecipeClick={handleAddRecipeClick} onRecipeClick={handleRecipeClick} />;
    case 'add-recipe':
      return <AddRecipe onBackHome={handleBackHome} onRecipeAdded={handleRecipeAdded} />;
    case 'recipe-detail':
      return <RecipeDetail recipeId={selectedRecipeId} onBackHome={handleBackHome} />;
    default:
      return <Home onAddRecipeClick={handleAddRecipeClick} onRecipeClick={handleRecipeClick} />;
  }
}

export default App;