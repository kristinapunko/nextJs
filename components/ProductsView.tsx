import {  Category, Product } from "@/sanity.types";
import ProductGrid from "./ProductGrid";
import { CategorySelectorComponent } from "./ui/category-selector";


interface ProductsViewProps {
    products: Product[];
    categories: Category[];
}

const ProductsView = ({products, categories}:ProductsViewProps) =>{
    return(
        <div>
            <div>
                <CategorySelectorComponent categories={categories}/>
            </div>
            <div>
                <div>
                    <ProductGrid products={products} />
                 
                </div>
            </div>
        </div>
    )
}

export default ProductsView;