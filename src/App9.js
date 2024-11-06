const products =[
    {title: 'Cabbage', isFruit:false, id:1},
    {title: 'Garlic',isFruit:false, id:2},
    {title: 'apple',isFruit:true, id:3},
];
export default function ShoppingList(){
const ListItems = products.map(product=>
<li key={product.id}
    style={{
        color: product.isFruit ? 'magenta ': 'darkgreen'
    }}>
        {product.title}
</li>

);
return (
    <ul>{ListItems}</ul>
);
}



