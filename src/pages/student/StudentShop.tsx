import { ShoppingBag, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import { getProductsByAcademia } from '@/data/mockData';

const StudentShop = () => {
  const { tenant } = useTenant();
  const products = tenant ? getProductsByAcademia(tenant.id) : [];
  const hasShopFeature = tenant?.plan?.features.shop;

  const handleBuy = (productName: string, price: number) => {
    const message = `Olá! Tenho interesse no produto: ${productName} - R$ ${price.toFixed(2)}`;
    const whatsappLink = `https://wa.me/${tenant?.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  if (!hasShopFeature) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Loja</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Loja não disponível</h3>
            <p className="text-muted-foreground">
              Esta academia não possui loja ativa.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Loja da Academia</h1>
        <p className="text-muted-foreground">Confira nossos produtos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="object-cover rounded-lg" />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              <p className="text-xl font-bold mt-2 text-primary">R$ {product.price.toFixed(2)}</p>
              <Button 
                className="w-full mt-4" 
                onClick={() => handleBuy(product.name, product.price)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Comprar via WhatsApp
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentShop;
