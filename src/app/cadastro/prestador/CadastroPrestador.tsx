
'use client';

import { useState } from 'react';
import { User, Upload, CheckCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CadastroPrestador() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(1);
  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    
    // Dados profissionais
    profissoes: [] as string[],
    novaProfissao: '',
    experiencia: '',
    descricao: '',
    endereco: '',
    cidade: '',
    cep: '',
    precoBase: '',
    
    // Disponibilidade
    disponibilidade: [] as string[],
    
    // Documentos
    cpf: '',
    rg: '',
    
    // Termos
    aceitaTermos: false
  });

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const adicionarProfissao = () => {
    if (formData.novaProfissao.trim() && !formData.profissoes.includes(formData.novaProfissao.trim())) {
      setFormData(prev => ({
        ...prev,
        profissoes: [...prev.profissoes, prev.novaProfissao.trim()],
        novaProfissao: ''
      }));
    }
  };

  const removerProfissao = (profissao: string) => {
    setFormData(prev => ({
      ...prev,
      profissoes: prev.profissoes.filter(p => p !== profissao)
    }));
  };

  const toggleDisponibilidade = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      disponibilidade: prev.disponibilidade.includes(dia)
        ? prev.disponibilidade.filter(d => d !== dia)
        : [...prev.disponibilidade, dia]
    }));
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
    if (formData.profissoes.length === 0 || !formData.experiencia || !formData.endereco) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    return true;
  };

  const validarEtapa3 = () => {
    if (!formData.cpf) {
      toast.error('NUIT é obrigatório');
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
    const prestador = {
      id: Date.now().toString(),
      ...formData,
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      avaliacao: 0,
      totalAvaliacoes: 0,
      galeria: [],
      ativo: true,
      dataCadastro: new Date().toISOString()
    };

    // Salvar no localStorage
    const prestadores = JSON.parse(localStorage.getItem('marketplace-prestadores-cadastrados') || '[]');
    prestadores.push(prestador);
    localStorage.setItem('marketplace-prestadores-cadastrados', JSON.stringify(prestadores));

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
            placeholder="(258) 9999999"
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
        <CardTitle>Dados Profissionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profissões */}
        <div>
          <Label>Profissões/Especialidades *</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={formData.novaProfissao}
              onChange={(e) => handleInputChange('novaProfissao', e.target.value)}
              placeholder="Ex: Eletricista, Encanador..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarProfissao())}
            />
            <Button type="button" onClick={adicionarProfissao} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.profissoes.map((profissao, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {profissao}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removerProfissao(profissao)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="experiencia">Tempo de Experiência *</Label>
          <Input
            id="experiencia"
            value={formData.experiencia}
            onChange={(e) => handleInputChange('experiencia', e.target.value)}
            placeholder="Ex: 5 anos, 10 anos"
          />
        </div>

        <div>
          <Label htmlFor="descricao">Descrição Profissional</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            placeholder="Descreva sua experiência e especialidades..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="endereco">Região de Atendimento *</Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => handleInputChange('endereco', e.target.value)}
            placeholder="Ex: Zona Sul, Centro, Toda a cidade"
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
            <Label htmlFor="cep">Caixa Postal</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
              placeholder="00000"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="precoBase">Preço Base por Hora (MT)</Label>
          <Input
            id="precoBase"
            type="number"
            step="0.01"
            value={formData.precoBase}
            onChange={(e) => handleInputChange('precoBase', e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* Disponibilidade */}
        <div>
          <Label>Disponibilidade</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {diasSemana.map((dia) => (
              <div key={dia} className="flex items-center space-x-2">
                <Checkbox
                  id={dia}
                  checked={formData.disponibilidade.includes(dia)}
                  onCheckedChange={() => toggleDisponibilidade(dia)}
                />
                <Label htmlFor={dia} className="text-sm">{dia}</Label>
              </div>
            ))}
          </div>
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
          <Label htmlFor="cpf">BI *</Label>
          <Input
            id="cpf"
            value={formData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            placeholder="00000000000"
          />
        </div>

       {/*  <div>
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            value={formData.rg}
            onChange={(e) => handleInputChange('rg', e.target.value)}
            placeholder="00.000.000-0"
          />
        </div> */}

        <div className="space-y-4 border-t pt-4">
          <div>
            <Label>Upload de Documentos e Portfólio</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Faça upload de documentos e fotos dos seus trabalhos
              </p>
              <Button variant="outline" size="sm">
                Selecionar Ficheiros
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
          Seu perfil profissional foi cadastrado e está sendo analisado. 
          Você receberá um e-mail de confirmação em breve.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/dashboard/prestador')}>
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
          <User className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-2">Cadastro de Prestador</h1>
          <p className="text-muted-foreground">
            Cadastre-se como prestador de serviços e comece a receber clientes
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
              <span>Profissionais</span>
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
