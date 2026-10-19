import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Language = "en" | "yo";

type Product = {
  id: number;
  name: string;
  category: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  emoji: string;
};

type Sale = {
  id: string;
  product: string;
  customer: string;
  time: string;
  amount: number;
  status: string;
};

const initialProducts: Product[] = [
  { id: 1, name: "Classic Senator Set", category: "Traditional", size: "L", color: "Navy", stock: 3, price: 28500, emoji: "👔" },
  { id: 2, name: "Premium Ankara Dress", category: "Dresses", size: "M", color: "Multicolour", stock: 12, price: 18500, emoji: "👗" },
  { id: 3, name: "Linen Casual Shirt", category: "Shirts", size: "XL", color: "Cream", stock: 2, price: 12000, emoji: "👕" },
  { id: 4, name: "Slim Fit Trousers", category: "Trousers", size: "L", color: "Black", stock: 8, price: 15000, emoji: "👖" },
  { id: 5, name: "Women’s Two-Piece", category: "Sets", size: "S", color: "Pink", stock: 1, price: 22000, emoji: "🩱" },
];

const initialSales: Sale[] = [
  { id: "SL-1048", product: "Premium Ankara Dress", customer: "Walk-in customer", time: "10:42 AM", amount: 18500, status: "Completed" },
  { id: "SL-1047", product: "Classic Senator Set", customer: "Walk-in customer", time: "10:15 AM", amount: 28500, status: "Completed" },
  { id: "SL-1046", product: "Linen Casual Shirt", customer: "A. Ibrahim", time: "9:38 AM", amount: 12000, status: "Completed" },
  { id: "SL-1045", product: "Slim Fit Trousers", customer: "Walk-in customer", time: "9:05 AM", amount: 15000, status: "Completed" },
];

const translations: Record<string, [string, string]> = {
  Dashboard: ["Dashboard", "Ọ̀rọ̀ Ajé"],
  Products: ["Products", "Àwọn Ọjà"],
  Inventory: ["Inventory", "Ìṣàkóso Ọjà"],
  Sales: ["Sales", "Ìtàjà"],
  Reports: ["Reports", "Àwọn Ìròyìn"],
  Settings: ["Settings", "Ètò"],
  Workspace: ["Workspace", "Ibi Iṣẹ́"],
  "My Boutique": ["Alh Baller Boutique", "Alh Baller Boutique"],
  "Shop workspace": ["Shop workspace", "Ibi iṣẹ́ ilé ìtajà"],
  "CLOTHING SHOP MANAGER": ["CLOTHING SHOP MANAGER", "ÌṢÀKÓSO ILÉ ÌTAJÀ AṢỌ"],
  WORKSPACE: ["WORKSPACE", "IBI IṢẸ́"],
  "Need a hand?": ["Need a hand?", "Ṣé o nílò ìrànlọ́wọ́?"],
  "Your shop tools, all in one simple place.": ["Your shop tools, all in one simple place.", "Gbogbo irinṣẹ́ ilé ìtajà rẹ ní ibi kan."],
  "Shop Owner": ["Shop Owner", "Olówó Ilé Ìtajà"],
  "Demo account": ["Demo account", "Àpẹẹrẹ Àkọọ́lẹ̀"],
  "Demo workspace": ["Demo workspace", "Àpẹẹrẹ Ibi Iṣẹ́"],
  "Good day, Shop Owner 👋": ["Good day, Shop Owner 👋", "Ẹ kú ọjọ́, Olówó Ilé Ìtajà 👋"],
  "Here’s what’s happening in your boutique today.": ["Here’s what’s happening in your boutique today.", "Èyí ni ohun tó ń ṣẹlẹ̀ ní ilé ìtajà rẹ lónìí."],
  "Your products": ["Your products", "Àwọn Ọjà Rẹ"],
  "Stock overview": ["Stock overview", "Àkótán Ọjà"],
  "Search your clothing catalogue.": ["Search your clothing catalogue.", "Wá aṣọ àti àwọn ọjà rẹ."],
  "Keep an eye on available quantities.": ["Keep an eye on available quantities.", "Máa ṣàyẹ̀wò iye ọjà tó kù."],
  "demo products": ["demo products", "ọjà àpẹẹrẹ"],
  "Search name, category, colour or size...": ["Search name, category, colour or size...", "Wá orúkọ, irú, àwọ̀ tàbí ìwọ̀n..."],
  Product: ["Product", "Ọjà"],
  "Size / Colour": ["Size / Colour", "Ìwọ̀n / Àwọ̀"],
  "In stock": ["In stock", "Ọjà tó kù"],
  "Selling price": ["Selling price", "Iye Ìtàjà"],
  items: ["items", "nǹkan"],
  "No products match that search.": ["No products match that search.", "A kò rí ọjà tó bá ìwádìí yìí mu."],
  "These are sample products for preview. Product registration and saved inventory come in a later stage.": [
    "These are sample products for preview. Product registration and saved inventory come in a later stage.",
    "Àwọn wọ̀nyí jẹ́ ọjà àpẹẹrẹ. A ó fi fífi ọjà tuntun kún un àti ìpamọ́ iye ọjà kún un ní ìpele tó tẹ̀ lé."
  ],
  "A preview of recent shop transactions.": ["A preview of recent shop transactions.", "Àpẹẹrẹ àwọn ìṣòwò tuntun ní ilé ìtajà rẹ."],
  "Demo sales only. We’ll build real sales recording, payment methods, receipts and automatic stock updates later.": [
    "Demo sales only. We’ll build real sales recording, payment methods, receipts and automatic stock updates later.",
    "Ìtàjà àpẹẹrẹ nìkan ni èyí. A ó ṣe àkọsílẹ̀ ìtàjà gidi, ọ̀nà ìsanwó, rísíìtì àti àtúnṣe iye ọjà lẹ́yìn náà."
  ],
  "Reports overview": ["Reports overview", "Àkótán Ìròyìn"],
  "Sample figures to help plan your business.": ["Sample figures to help plan your business.", "Àwọn nọ́ńbà àpẹẹrẹ láti ràn ọ́ lọ́wọ́ láti ṣètò iṣẹ́ rẹ."],
  "Estimated stock selling value": ["Estimated stock selling value", "Iye Títà Ọjà Tó Kù"],
  "Based on demo selling prices": ["Based on demo selling prices", "Gẹ́gẹ́ bí iye títà àpẹẹrẹ"],
  "Items currently in stock": ["Items currently in stock", "Iye Ọjà Tó Wà"],
  "Across demo products": ["Across demo products", "Láàárín àwọn ọjà àpẹẹrẹ"],
  "Low-stock products": ["Low-stock products", "Ọjà Tó Kù Díẹ̀"],
  "Three items or fewer": ["Three items or fewer", "Nǹkan mẹ́ta tàbí díẹ̀ sí i"],
  "These are illustrative figures, not financial records. Real reports will use saved purchases and completed sales.": [
    "These are illustrative figures, not financial records. Real reports will use saved purchases and completed sales.",
    "Àwọn nọ́ńbà wọ̀nyí jẹ́ àpẹẹrẹ, kì í ṣe àkọsílẹ̀ owó gidi. Ìròyìn gidi yóò lo àwọn ìràjà àti ìtàjà tí a ti fi pamọ́."
  ],
  "Shop settings": ["Shop settings", "Ètò Ilé Ìtajà"],
  "Your shop preferences will live here.": ["Your shop preferences will live here.", "Àwọn àṣàyàn ilé ìtajà rẹ yóò wà níbí."],
  Currency: ["Currency", "Owó"],
  "Nigerian naira (NGN)": ["Nigerian naira (NGN)", "Náírà Nàìjíríà (NGN)"],
  Default: ["Default", "Èyí Tí A Yàn"],
  "Inventory tracking": ["Inventory tracking", "Ìṣàkóso Iye Ọjà"],
  "Sizes, colours and quantities": ["Sizes, colours and quantities", "Ìwọ̀n, àwọ̀ àti iye ọjà"],
  Planned: ["Planned", "A Ṣì Ń Ṣètò"],
  "Shop profile, user accounts and secure settings will be added in later stages.": [
    "Shop profile, user accounts and secure settings will be added in later stages.",
    "A ó fi àkọsílẹ̀ ilé ìtajà, àkọọ́lẹ̀ àwọn olùlò àti ètò ààbò kún un ní àwọn ìpele tó tẹ̀ lé."
  ],
  "Today's sales": ["Today's sales", "Ìtàjà Lónìí"],
  "Estimated profit": ["Estimated profit", "Èrè Tí A Fojú Díwọ̀n"],
  "Products listed": ["Products listed", "Iye Ọjà Tí A Forúkọ Sílẹ̀"],
  "Items in stock": ["Items in stock", "Ọjà Tó Wà"],
  "Demo figure": ["Demo figure", "Nọ́ńbà Àpẹẹrẹ"],
  "sample transactions": ["sample transactions", "ìṣòwò àpẹẹrẹ"],
  "Illustrative margin only": ["Illustrative margin only", "Èrè Àpẹẹrẹ Nìkan"],
  "Sample catalogue": ["Sample catalogue", "Àkójọ Ọjà Àpẹẹrẹ"],
  "products need attention": ["products need attention", "ọjà nílò àbójútó"],
  "Recent sales": ["Recent sales", "Ìtàjà Tuntun"],
  "Latest transactions in your shop": ["Latest transactions in your shop", "Àwọn ìṣòwò tuntun ní ilé ìtajà rẹ"],
  "View all": ["View all", "Wo Gbogbo Rẹ̀"],
  "Sample data — no real sales have been recorded.": ["Sample data — no real sales have been recorded.", "Àpẹẹrẹ ni èyí — a kò tíì ṣe àkọsílẹ̀ ìtàjà gidi."],
  "Low stock alerts": ["Low stock alerts", "Ìkìlọ̀ Ọjà Tó Kù Díẹ̀"],
  "Items that may need restocking": ["Items that may need restocking", "Ọjà tó lè nílò àfikún"],
  left: ["left", "ló kù"],
  "Manage inventory": ["Manage inventory", "Ṣàkóso Iye Ọjà"],
  "Quick actions": ["Quick actions", "Àwọn Iṣẹ́ Kíákíá"],
  "Shortcuts to common tasks": ["Shortcuts to common tasks", "Àwọn ọ̀nà kúkúrú sí àwọn iṣẹ́ ojoojúmọ́"],
  "View products": ["View products", "Wo Àwọn Ọjà"],
  "Browse your catalogue": ["Browse your catalogue", "Ṣàyẹ̀wò àkójọ ọjà rẹ"],
  "View sales": ["View sales", "Wo Ìtàjà"],
  "Review transactions": ["Review transactions", "Ṣàyẹ̀wò àwọn ìṣòwò"],
  "View reports": ["View reports", "Wo Ìròyìn"],
  "Check shop figures": ["Check shop figures", "Ṣàyẹ̀wò nọ́ńbà ilé ìtajà"],
  "YOUR SHOP, SIMPLIFIED": ["YOUR SHOP, SIMPLIFIED", "ILÉ ÌTAJÀ RẸ, TÍ Ó RỌRÙN"],
  "More time for": ["More time for", "Àkókò Síi Fún"],
  "what you love.": ["what you love.", "Ohun Tí O Fẹ́."],
  "Keep your products, stock and sales organised in one place.": ["Keep your products, stock and sales organised in one place.", "Ṣètò àwọn ọjà, iye ọjà àti ìtàjà rẹ ní ibi kan."],
  "SALE ID": ["SALE ID", "NỌ́ŃBÀ ÌTAJÀ"],
  PRODUCT: ["PRODUCT", "ỌJÀ"],
  TIME: ["TIME", "ÀKÓKÒ"],
  AMOUNT: ["AMOUNT", "IYE OWÓ"],
  STATUS: ["STATUS", "IPÒ"],
  Completed: ["Completed", "Ti Parí"],
  "Clothing Shop Manager": ["Clothing Shop Manager", "Ìṣàkóso Ilé Ìtajà Aṣọ"],
  "Demo version · Your business, beautifully organised.": ["Demo version · Your business, beautifully organised.", "Ẹ̀dà àpẹẹrẹ · Iṣẹ́ rẹ wà ní ìṣètò tó dára."],
};

const tr = (key: string, language: Language): string => {
  const entry = translations[key];
  return entry ? entry[language === "yo" ? 1 : 0] : key;
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);


  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem("closetwise-language");
      return savedLanguage === "yo" ? "yo" : "en";
    } catch {
      return "en";
    }
  });
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem("closetwise-products");

      if (savedProducts) {
        const parsedProducts: unknown = JSON.parse(savedProducts);

        if (Array.isArray(parsedProducts)) {
          return parsedProducts as Product[];
        }
      }
    } catch (error) {
      console.error("Could not load saved products:", error);
    }

    return initialProducts;
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Shirts",
    size: "M",
    color: "",
    stock: "0",
    price: "0",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    try {
      localStorage.setItem("closetwise-language", language);
    } catch (error) {
      console.error("Could not save language preference:", error);
    }
  }, [language]);

  
  useEffect(() => {
    try {
      localStorage.setItem("closetwise-products", JSON.stringify(products));
    } catch (error) {
      console.error("Could not save products in this browser:", error);
    }
  }, [products]);


  const t = (key: string) => tr(key, language);

  const navItems = [
    { label: "Dashboard", icon: "▦" },
    { label: "Products", icon: "▤" },
    { label: "Inventory", icon: "▥" },
    { label: "Sales", icon: "↗" },
    { label: "Reports", icon: "▧" },
  ];

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.category} ${product.color} ${product.size}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [products, search]
  );

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStock = products.filter((product) => product.stock <= 3);
  const stockValue = products.reduce((sum, product) => sum + product.stock * product.price, 0);

  const openNewProductForm = () => {
    setEditingProductId(null);
    setProductForm({
      name: "",
      category: "Shirts",
      size: "M",
      color: "",
      stock: "0",
      price: "0",
    });
    setShowProductForm(true);
  };

  const openEditProductForm = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      size: product.size,
      color: product.color,
      stock: String(product.stock),
      price: String(product.price),
    });
    setShowProductForm(true);
  };

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = productForm.name.trim();
    const color = productForm.color.trim();
    const stock = Number(productForm.stock);
    const price = Number(productForm.price);

    if (!name || !color || !Number.isInteger(stock) || stock < 0 ||
        !Number.isFinite(price) || price < 0 || productForm.price.trim() === "") {
      window.alert("Enter a product name, colour, valid stock quantity and price.");
      return;
    }

    const categoryEmojis: Record<string, string> = {
      Traditional: "👔",
      Dresses: "👗",
      Shirts: "👕",
      Trousers: "👖",
      Sets: "🩱",
      Shoes: "👟",
      Accessories: "👜",
    };

    if (editingProductId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                name,
                category: productForm.category,
                size: productForm.size,
                color,
                stock,
                price,
                emoji: categoryEmojis[productForm.category] || "👚",
              }
            : product
        )
      );
    } else {
      const newProduct: Product = {
        id: Math.max(0, ...products.map((product) => product.id)) + 1,
        name,
        category: productForm.category,
        size: productForm.size,
        color,
        stock,
        price,
        emoji: categoryEmojis[productForm.category] || "👚",
      };
      setProducts((current) => [...current, newProduct]);
    }

    setShowProductForm(false);
    setEditingProductId(null);
  };

  const deleteProduct = (product: Product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone after you leave this session.`
    );

    if (confirmed) {
      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
    }
  };

  const renderPage = () => {
    if (activePage === "Products" || activePage === "Inventory") {
      return (
        <>
          <section className="panel products-panel">
            <div className="panel-heading product-manager-heading">
              <div>
                <h2>{t(activePage === "Products" ? "Your products" : "Stock overview")}</h2>
                <p>{t(activePage === "Products" ? "Search your clothing catalogue." : "Keep an eye on available quantities.")}</p>
              </div>
              <button className="gold-action-button" onClick={openNewProductForm} type="button">
                <span>＋</span> {language === "yo" ? "Fi Ọjà Kún Un" : "Add product"}
              </button>
            </div>

            <div className="product-summary-strip">
              <div><span>{language === "yo" ? "Àwọn Ọjà" : "Products"}</span><strong>{products.length}</strong></div>
              <div><span>{language === "yo" ? "Ọjà Tó Wà" : "Units in stock"}</span><strong>{totalStock}</strong></div>
              <div><span>{language === "yo" ? "Ọjà Tó Kù Díẹ̀" : "Low stock"}</span><strong>{lowStock.length}</strong></div>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                aria-label={t("Search name, category, colour or size...")}
                placeholder={t("Search name, category, colour or size...")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t("Product")}</th>
                    <th>{t("Size / Colour")}</th>
                    <th>{t("In stock")}</th>
                    <th>{t("Selling price")}</th>
                    <th>{language === "yo" ? "Àwọn Iṣẹ́" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <span className="product-emoji">{product.emoji}</span>
                        <strong>{product.name}</strong>
                        <small>{product.category}</small>
                      </td>
                      <td>{product.size} · {product.color}</td>
                      <td>
                        <span className={product.stock <= 3 ? "stock-pill low" : "stock-pill"}>
                          {product.stock} {t("items")}
                        </span>
                      </td>
                      <td className="amount">{money(product.price)}</td>
                      <td>
                        <div className="product-row-actions">
                          <button type="button" className="edit-product-button" onClick={() => openEditProductForm(product)}>
                            {language === "yo" ? "Ṣàtúnṣe" : "Edit"}
                          </button>
                          <button type="button" className="delete-product-button" onClick={() => deleteProduct(product)}>
                            {language === "yo" ? "Pa rẹ́" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <p className="empty-message">{t("No products match that search.")}</p>
              )}
            </div>
            <p className="demo-note">
              {language === "yo"
                ? "Àwọn àyípadà yìí wà fún ìgbà tí app bá ṣí. A ó fi ìpamọ́ pípẹ́ kún un lẹ́yìn náà."
                : "Product changes currently last for this app session. Permanent saving will be added next."}
            </p>
          </section>

          {showProductForm && (
            <div className="product-modal-backdrop" onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowProductForm(false);
            }}>
              <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
                <div className="product-modal-heading">
                  <div>
                    <span className="product-modal-kicker">ALH BALLER BOUTIQUE · INVENTORY</span>
                    <h2 id="product-form-title">
                      {editingProductId !== null
                        ? (language === "yo" ? "Ṣàtúnṣe Ọjà" : "Edit product")
                        : (language === "yo" ? "Fi Ọjà Tuntun Kún Un" : "Add a new product")}
                    </h2>
                    <p>{language === "yo" ? "Kún àlàyé ọjà rẹ sílẹ̀." : "Enter the details for your clothing item."}</p>
                  </div>
                  <button type="button" className="modal-close-button" aria-label="Close form" onClick={() => setShowProductForm(false)}>×</button>
                </div>

                <form className="product-form" onSubmit={saveProduct}>
                  <label>
                    {language === "yo" ? "Orúkọ Ọjà" : "Product name"}
                    <input autoFocus required maxLength={100} value={productForm.name} placeholder="e.g. Premium Lace Outfit"
                      onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
                  </label>

                  <label>
                    {language === "yo" ? "Ẹ̀ka Ọjà" : "Category"}
                    <select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>
                      <option value="Shirts">Shirts</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Trousers">Trousers</option>
                      <option value="Sets">Sets</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </label>

                  <div className="product-form-two-columns">
                    <label>
                      {language === "yo" ? "Ìwọ̀n" : "Size"}
                      <select value={productForm.size} onChange={(event) => setProductForm({ ...productForm, size: event.target.value })}>
                        <option value="XS">XS</option><option value="S">S</option><option value="M">M</option>
                        <option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option>
                        <option value="Free Size">Free Size</option>
                      </select>
                    </label>
                    <label>
                      {language === "yo" ? "Àwọ̀" : "Colour"}
                      <input required maxLength={50} value={productForm.color} placeholder="e.g. Wine"
                        onChange={(event) => setProductForm({ ...productForm, color: event.target.value })} />
                    </label>
                  </div>

                  <div className="product-form-two-columns">
                    <label>
                      {language === "yo" ? "Iye Ọjà Tó Wà" : "Stock quantity"}
                      <input type="number" min="0" step="1" required value={productForm.stock}
                        onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} />
                    </label>
                    <label>
                      {language === "yo" ? "Iye Ìtàjà (₦)" : "Selling price (₦)"}
                      <input type="number" min="0" step="1" required value={productForm.price}
                        onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} />
                    </label>
                  </div>

                  <div className="product-form-footer">
                    <button type="button" className="cancel-product-button" onClick={() => setShowProductForm(false)}>
                      {language === "yo" ? "Fagilé" : "Cancel"}
                    </button>
                    <button type="submit" className="gold-action-button">
                      {editingProductId !== null
                        ? (language === "yo" ? "Fi Àyípadà Pamọ́" : "Save changes")
                        : (language === "yo" ? "Fi Ọjà Kún Un" : "Add product")}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </>
      );
    }

    if (activePage === "Sales") {
      return (
        <section className="panel">
          <div className="panel-heading">
            <div><h2>{t("Sales")}</h2><p>{t("A preview of recent shop transactions.")}</p></div>
          </div>
          <SalesTable language={language} />
          <p className="demo-note">{t("Demo sales only. We’ll build real sales recording, payment methods, receipts and automatic stock updates later.")}</p>
        </section>
      );
    }

    if (activePage === "Reports") {
      return (
        <section className="panel">
          <div className="panel-heading">
            <div><h2>{t("Reports overview")}</h2><p>{t("Sample figures to help plan your business.")}</p></div>
          </div>
          <div className="report-grid">
            <div className="report-tile"><span>{t("Estimated stock selling value")}</span><strong>{money(stockValue)}</strong><small>{t("Based on demo selling prices")}</small></div>
            <div className="report-tile"><span>{t("Items currently in stock")}</span><strong>{totalStock}</strong><small>{t("Across demo products")}</small></div>
            <div className="report-tile"><span>{t("Low-stock products")}</span><strong>{lowStock.length}</strong><small>{t("Three items or fewer")}</small></div>
          </div>
          <p className="demo-note">{t("These are illustrative figures, not financial records. Real reports will use saved purchases and completed sales.")}</p>
        </section>
      );
    }

    if (activePage === "Settings") {
      return (
        <section className="panel">
          <div className="panel-heading">
            <div><h2>{t("Shop settings")}</h2><p>{t("Your shop preferences will live here.")}</p></div>
          </div>
          <div className="settings-preview">
            <span className="settings-icon">₦</span>
            <div><strong>{t("Currency")}</strong><p>{t("Nigerian naira (NGN)")}</p></div>
            <span className="soft-tag">{t("Default")}</span>
          </div>
          <div className="settings-preview">
            <span className="settings-icon">▦</span>
            <div><strong>{t("Inventory tracking")}</strong><p>{t("Sizes, colours and quantities")}</p></div>
            <span className="soft-tag">{t("Planned")}</span>
          </div>
          <p className="demo-note">{t("Shop profile, user accounts and secure settings will be added in later stages.")}</p>
        </section>
      );
    }

    return (
      <>
        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top"><span>{t("Today's sales")}</span><span className="stat-icon green">↗</span></div>
            <strong>{money(74000)}</strong>
            <p className="stat-foot"><span className="positive">{t("Demo figure")}</span> · 4 {t("sample transactions")}</p>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span>{t("Estimated profit")}</span><span className="stat-icon purple">₦</span></div>
            <strong>{money(21800)}</strong>
            <p className="stat-foot">{t("Illustrative margin only")}</p>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span>{t("Products listed")}</span><span className="stat-icon orange">▤</span></div>
            <strong>{products.length}</strong>
            <p className="stat-foot">{t("Sample catalogue")}</p>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span>{t("Items in stock")}</span><span className="stat-icon blue">▥</span></div>
            <strong>{totalStock}</strong>
            <p className="stat-foot">{lowStock.length} {t("products need attention")}</p>
          </article>
        </section>

        <section className="dashboard-grid">
          <div className="panel sales-panel">
            <div className="panel-heading">
              <div><h2>{t("Recent sales")}</h2><p>{t("Latest transactions in your shop")}</p></div>
              <button className="text-button" onClick={() => setActivePage("Sales")}>{t("View all")} <span>→</span></button>
            </div>
            <SalesTable language={language} />
            <p className="demo-note">{t("Sample data — no real sales have been recorded.")}</p>
          </div>
          <div className="panel stock-panel">
            <div className="panel-heading">
              <div><h2>{t("Low stock alerts")}</h2><p>{t("Items that may need restocking")}</p></div>
              <span className="alert-count">{lowStock.length}</span>
            </div>
            <div className="low-stock-list">
              {lowStock.map((product) => (
                <div className="low-stock-item" key={product.id}>
                  <span className="product-emoji">{product.emoji}</span>
                  <div className="low-stock-info"><strong>{product.name}</strong><small>{product.size} · {product.color}</small></div>
                  <span className="stock-pill low">{product.stock} {t("left")}</span>
                </div>
              ))}
            </div>
            <button className="outline-button full-button" onClick={() => setActivePage("Inventory")}>{t("Manage inventory")} <span>→</span></button>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel quick-panel">
            <div className="panel-heading"><div><h2>{t("Quick actions")}</h2><p>{t("Shortcuts to common tasks")}</p></div></div>
            <div className="quick-actions">
              <button onClick={() => setActivePage("Products")}><span className="quick-icon lavender">＋</span><span><strong>{t("View products")}</strong><small>{t("Browse your catalogue")}</small></span><span className="action-arrow">→</span></button>
              <button onClick={() => setActivePage("Sales")}><span className="quick-icon mint">↗</span><span><strong>{t("View sales")}</strong><small>{t("Review transactions")}</small></span><span className="action-arrow">→</span></button>
              <button onClick={() => setActivePage("Reports")}><span className="quick-icon peach">▧</span><span><strong>{t("View reports")}</strong><small>{t("Check shop figures")}</small></span><span className="action-arrow">→</span></button>
            </div>
          </div>
          <div className="welcome-card">
            <span className="welcome-sparkle">✦</span>
            <p className="eyebrow">{t("YOUR SHOP, SIMPLIFIED")}</p>
            <h2>{t("More time for")}<br />{t("what you love.")}</h2>
            <p>{t("Keep your products, stock and sales organised in one place.")}</p>
            <span className="welcome-decoration">✳</span>
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="app-shell">
      {showWelcome && (
        <div className="welcome-screen" role="status" aria-live="polite">
          <div className="welcome-ornament welcome-ornament-top" />
          <div className="welcome-content">
            <div className="welcome-emblem">A<span>✦</span></div>
            <p className="welcome-eyebrow">ALH BALLER BOUTIQUE</p>
            <div className="welcome-divider"><span>✦</span></div>
            <h1>Welcome <span>Alhaja Bola</span></h1>
            <p className="welcome-yoruba">Ẹ kú ọ̀rọ̀ ajé</p>
            <p className="welcome-subtitle">
              {language === "yo"
                ? "Ọjọ́ tuntun tó dára fún ìdàgbàsókè iṣẹ́ rẹ."
                : "A beautiful day to grow your business."}
            </p>

            <div className="welcome-language" aria-label="Choose language">
              <button
                type="button"
                className={`welcome-language-option ${language === "en" ? "selected" : ""}`}
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
              >
                English
              </button>
              <button
                type="button"
                className={`welcome-language-option ${language === "yo" ? "selected" : ""}`}
                aria-pressed={language === "yo"}
                onClick={() => setLanguage("yo")}
              >
                Yorùbá
              </button>
            </div>

            <button
              type="button"
              className="welcome-enter"
              onClick={() => setShowWelcome(false)}
            >
              {language === "yo" ? "Wọlé sí Ilé Ìtajà" : "Enter Boutique"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="welcome-ornament welcome-ornament-bottom" />
        </div>
      )}

      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">C<span>+</span></div>
          <div><strong>Alh Baller<span> Boutique</span></strong><small>{t("CLOTHING SHOP MANAGER")}</small></div>
        </div>

        <div className="shop-switcher">
          <div className="shop-avatar">A</div>
          <div><strong>{t("My Boutique")}</strong><small>{t("Shop workspace")}</small></div>
          <span className="switch-chevron">⌄</span>
        </div>

        <p className="nav-label">{t("WORKSPACE")}</p>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-item ${activePage === item.label ? "active" : ""}`} onClick={() => { setActivePage(item.label); setMobileMenuOpen(false); }}>
              <span className="nav-icon">{item.icon}</span><span>{t(item.label)}</span>
              {item.label === "Inventory" && <span className="nav-badge">{lowStock.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card"><span>✦</span><strong>{t("Need a hand?")}</strong><p>{t("Your shop tools, all in one simple place.")}</p></div>
          <button className={`nav-item ${activePage === "Settings" ? "active" : ""}`} onClick={() => { setActivePage("Settings"); setMobileMenuOpen(false); }}>
            <span className="nav-icon">⚙</span><span>{t("Settings")}</span>
          </button>
          <div className="profile-mini"><div className="profile-avatar">A</div><div><strong>{t("Shop Owner")}</strong><small>{t("Demo account")}</small></div><span className="profile-dots">•••</span></div>
        </div>
      </aside>

      {mobileMenuOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-button" aria-label="Open navigation menu" onClick={() => setMobileMenuOpen(true)}>☰</button>
          <div className="breadcrumb">{t("Workspace")} <span>/</span> <strong>{t(activePage)}</strong></div>
          <div className="topbar-right">
            <button
              type="button"
              className="language-toggle"
              aria-label="Switch interface language"
              onClick={() => setLanguage(language === "en" ? "yo" : "en")}
            >
              {language === "en" ? "🇳🇬 Yorùbá" : "🇬🇧 English"}
            </button>
            <span className="today-label">● <span>{t("Demo workspace")}</span></span>
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">{language === "yo" ? "ÀKÓTÁN IṢẸ́ ILÉ ÌTAJÀ RẸ" : "MONDAY, YOUR SHOP AT A GLANCE"}</p>
              <h1>{activePage === "Dashboard" ? (language === "yo" ? "Ọ̀rọ̀ Ajé" : "Good day, Shop Owner 👋") : t(activePage)}</h1>
              <p className="page-subtitle">{activePage === "Dashboard" ? t("Here’s what’s happening in your boutique today.") : `${language === "yo" ? "Ṣàyẹ̀wò" : "Explore your"} ${t(activePage).toLowerCase()} ${language === "yo" ? "níbí." : "workspace."}`}</p>
            </div>
            <span className="date-chip">▦ <span>{new Date().toLocaleDateString(language === "yo" ? "yo-NG" : "en-NG", { day: "numeric", month: "short", year: "numeric" })}</span></span>
          </div>

          {renderPage()}

          <footer className="app-footer">
            <span>Alh Baller Boutique <span>•</span> {t("Clothing Shop Manager")}</span>
            <span>{language === "yo" ? "Ẹ̀dà àpẹẹrẹ" : "Demo version"} · {t("Demo version · Your business, beautifully organised.").split(" · ").pop()}</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function SalesTable({ language }: { language: Language }) {
  const t = (key: string) => tr(key, language);

  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>{t("SALE ID")}</th><th>{t("PRODUCT")}</th><th>{t("TIME")}</th><th>{t("AMOUNT")}</th><th>{t("STATUS")}</th></tr></thead>
        <tbody>
          {initialSales.map((sale) => (
            <tr key={sale.id}>
              <td className="sale-id">{sale.id}</td>
              <td><strong>{sale.product}</strong><small>{sale.customer}</small></td>
              <td className="muted-cell">{sale.time}</td>
              <td className="amount">{money(sale.amount)}</td>
              <td><span className="status-pill">{t(sale.status)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
