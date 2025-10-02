
'use client';

import { useState } from 'react';
import { Store, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CadastroMerchant() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(1);
  const [formData, setFormData] = useState({
    // Dados básicos
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    
    // Dados do estabelecimento
    nomeEstabelecimento: '',
    tipo: '',
    descricao: '',
    endereco: '',
    cidade: '',
    cep: '',
    horarioFuncionamento: '',
    
    // Configurações de entrega
    fazEntrega: false,
    tempoEntrega: '',
    taxaEntrega: '',
    entregaGratis: false,
    
    // Documentos
    cnpj: '',
    inscricaoEstadual: '',
    
    // Termos
    aceitaTermos: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validarEtapa1 = () => {
    if (!formData.nome || !formData.email || !formData.telefone || !formData.senha) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return false;
    }
    return true;
  };

  const validarEtapa2 = () => {
    if (!formData.nomeEstabelecimento || !formData.tipo || !formData.endereco) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    return true;
  };

  const validarEtapa3 = () => {
    if (!formData.cnpj) {
      toast.error('CNPJ é obrigatório');
      return false;
    }
    if (!formData.aceitaTermos) {
      toast.error('Você deve aceitar os termos de uso');
      return false;
    }
    return true;
  };

  const proximaEtapa = () => {
    let valido = false;
    
    switch (etapa) {
      case 1:
        valido = validarEtapa1();
        break;
      case 2:
        valido = validarEtapa2();
        break;
      case 3:
        valido = validarEtapa3();
        break;
    }
    
    if (valido) {
      if (etapa < 4) {
        setEtapa(etapa + 1);
      } else {
        finalizarCadastro();
      }
    }
  };

  const finalizarCadastro = () => {
    // Simular cadastro
    const merchant = {
      id: Date.now().toString(),
      ...formData,
      slug: formData.nomeEstabelecimento.toLowerCase().replace(/\s+/g, '-'),
      logo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop&crop=center',
      banner: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop&crop=center',
      avaliacao: 0,
      totalAvaliacoes: 0,
      destaque: false,
      ativo: true,
      dataCadastro: new Date().toISOString()
    };

    // Salvar no localStorage
    const merchants = JSON.parse(localStorage.getItem('marketplace-merchants-cadastrados') || '[]');
    merchants.push(merchant);
    localStorage.setItem('marketplace-merchants-cadastrados', JSON.stringify(merchants));

    toast.success('Cadastro realizado com sucesso!');
    setEtapa(4);
  };

  const renderEtapa1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Dados Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => handleInputChange('telefone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <Label htmlFor="senha">Senha *</Label>
          <Input
            id="senha"
            type="password"
            value={formData.senha}
            onChange={(e) => handleInputChange('senha', e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
          <Input
            id="confirmarSenha"
            type="password"
            value={formData.confirmarSenha}
            onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
            placeholder="Confirme sua senha"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderEtapa2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Estabelecimento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nomeEstabelecimento">Nome do Estabelecimento *</Label>
          <Input
            id="nomeEstabelecimento"
            value={formData.nomeEstabelecimento}
            onChange={(e) => handleInputChange('nomeEstabelecimento', e.target.value)}
            placeholder="Nome da sua loja/restaurante"
          />
        </div>

        <div>
          <Label htmlFor="tipo">Tipo de Estabelecimento *</Label>
          <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loja">Loja</SelectItem>
              <SelectItem value="farmacia">Farmácia</SelectItem>
              <SelectItem value="restaurante">Restaurante</SelectItem>
              <SelectItem value="petshop">Pet Shop</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            placeholder="Descreva seu estabelecimento..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="endereco">Endereço Completo *</Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => handleInputChange('endereco', e.target.value)}
            placeholder="Rua, número, bairro"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
              placeholder="Sua cidade"
            />
          </div>
          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
              placeholder="00000-000"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="horarioFuncionamento">Horário de Funcionamento</Label>
          <Input
            id="horarioFuncionamento"
            value={formData.horarioFuncionamento}
            onChange={(e) => handleInputChange('horarioFuncionamento', e.target.value)}
            placeholder="Ex: Seg-Sex: 8h às 18h"
          />
        </div>

        {/* Configurações de Entrega */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fazEntrega"
              checked={formData.fazEntrega}
              onCheckedChange={(checked) => handleInputChange('fazEntrega', checked)}
            />
            <Label htmlFor="fazEntrega">Oferece serviço de entrega</Label>
          </div>

          {formData.fazEntrega && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tempoEntrega">Tempo de Entrega</Label>
                  <Input
                    id="tempoEntrega"
                    value={formData.tempoEntrega}
                    onChange={(e) => handleInputChange('tempoEntrega', e.target.value)}
                    placeholder="Ex: 30-45 min"
                  />
                </div>
                <div>
                  <Label htmlFor="taxaEntrega">Taxa de Entrega (R$)</Label>
                  <Input
                    id="taxaEntrega"
                    type="number"
                    step="0.01"
                    value={formData.taxaEntrega}
                    onChange={(e) => handleInputChange('taxaEntrega', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="entregaGratis"
                  checked={formData.entregaGratis}
                  onCheckedChange={(checked) => handleInputChange('entregaGratis', checked)}
                />
                <Label htmlFor="entregaGratis">Entrega grátis</Label>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderEtapa3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Documentação e Finalização</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => handleInputChange('cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div>
          <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
          <Input
            id="inscricaoEstadual"
            value={formData.inscricaoEstadual}
            onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
            placeholder="Opcional"
          />
        </div>

        <div className="space-y-4 border-t pt-4">
          <div>
            <Label>Upload de Documentos</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Faça upload dos documentos necessários
              </p>
              <Button variant="outline" size="sm">
                Selecionar Arquivos
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="aceitaTermos"
            checked={formData.aceitaTermos}
            onCheckedChange={(checked) => handleInputChange('aceitaTermos', checked)}
          />
          <Label htmlFor="aceitaTermos" className="text-sm">
            Aceito os termos de uso e política de privacidade *
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderSucesso = () => (
    <Card>
      <CardContent className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Cadastro Realizado com Sucesso!</h2>
        <p className="text-muted-foreground mb-6">
          Seu estabelecimento foi cadastrado e está sendo analisado. 
          Você receberá um e-mail de confirmação em breve.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/dashboard/merchant')}>
            Acessar Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Voltar ao Início
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <Store className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-2">Cadastro de Estabelecimento</h1>
          <p className="text-muted-foreground">
            Cadastre seu estabelecimento e comece a vender no marketplace
          </p>
        </div>

        {/* Indicador de Progresso */}
        {etapa < 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= etapa ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < etapa ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Dados Pessoais</span>
              <span>Estabelecimento</span>
              <span>Finalização</span>
            </div>
          </div>
        )}

        {/* Conteúdo das Etapas */}
        {etapa === 1 && renderEtapa1()}
        {etapa === 2 && renderEtapa2()}
        {etapa === 3 && renderEtapa3()}
        {etapa === 4 && renderSucesso()}

        {/* Botões de Navegação */}
        {etapa < 4 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setEtapa(Math.max(1, etapa - 1))}
              disabled={etapa === 1}
            >
              Voltar
            </Button>
            <Button onClick={proximaEtapa}>
              {etapa === 3 ? 'Finalizar Cadastro' : 'Próximo'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
