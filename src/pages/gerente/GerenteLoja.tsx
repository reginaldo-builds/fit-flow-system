import { useState } from 'react';
import { ShoppingBag, Plus, Search, Edit, Trash2, ExternalLink, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { plans, getProductsByAcademia } from '@/data/mockData';

const GerenteLoja = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    isActive: true
  });

  if (!tenant) return null;

  const plan = plans.find(p => p.id === tenant.planId);
  const hasShop = plan?.features.shop;
  const products = getProductsByAcademia(tenant.id);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    toast({
      title: 'Produto adicionado',
      description: `${newProduct.name} foi adicionado à loja.`,
    });
    setAddDialogOpen(false);
    setNewProduct({ name: '', description: '', price: '', imageUrl: '', isActive: true });
  };

  const getWhatsAppLink = (product: typeof products[0]) => {
    const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2)}`;
    return `https://wa.me/${tenant.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  if (!hasShop) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loja</h1>
          <p className="text-muted-foreground">
            Venda produtos para seus alunos
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Recurso não disponível</h3>
              <p className="text-muted-foreground mt-2">
                A lojinha de produtos está disponível apenas no plano Elite.
              </p>
              <Button className="mt-4">
                Fazer Upgrade para Elite
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loja</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos da sua vitrine
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Produto</DialogTitle>
              <DialogDescription>
                Cadastre um novo produto na vitrine da sua academia.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ex: Whey Protein 1kg"
                />
              </div>
              <div>
                <Label htmlFor="productDescription">Descrição</Label>
                <Textarea
                  id="productDescription"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Descreva o produto..."
                />
              </div>
              <div>
                <Label htmlFor="productPrice">Preço (R$)</Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="99.90"
                />
              </div>
              <div>
                <Label htmlFor="productImage">URL da Imagem</Label>
                <Input
                  id="productImage"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="productActive">Produto Ativo</Label>
                <Switch
                  id="productActive"
                  checked={newProduct.isActive}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddProduct}>
                Adicionar Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Produtos ({products.length})
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado ainda'}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {!product.isActive && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold mt-2">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(getWhatsAppLink(product), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como funciona a Loja</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• A loja é uma vitrine de produtos para seus alunos</li>
            <li>• Quando o aluno clica em "Comprar", ele é redirecionado para seu WhatsApp</li>
            <li>• A negociação e pagamento são feitos diretamente com você</li>
            <li>• Produtos inativos não aparecem para os alunos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenteLoja;
