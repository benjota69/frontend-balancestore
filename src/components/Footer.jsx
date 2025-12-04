// Componente Texto Al final de la página. (Footer)

export default function Footer() {
  return (
    <footer style={{borderTop:'1px solid #cfe8d8', background:'#e9f5ec', color:'#2e7d32'}}>
      <div className="container py-3" style={{textAlign:'center'}}>
        <small>© {new Date().getFullYear()} BalanceStore · Tienda electrónica y gaming 2025</small>
      </div>
    </footer>
  )
}


