import { Store, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function CadastroSection() {
	return (
		<section className='py-16 bg-muted/50'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-bold mb-4'>
						Faça Parte do Nosso Marketplace
					</h2>
					<p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
						Cadastre seu estabelecimento ou ofereça seus serviços profissionais.
						Conecte-se com milhares de clientes em potencial.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
					{/* Cadastro Merchant */}
					<Card className='hover:shadow-lg transition-shadow'>
						<CardContent className='p-8 text-center'>
							<div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
								<Store className='h-8 w-8' style={{ color: '#FF6900' }} />
							</div>

							<h3 className='text-2xl font-bold mb-4'>Sou Comerciante</h3>
							<p className='text-muted-foreground mb-6'>
								Cadastre seu estabelecimento e comece a vender online. Gerencie
								produtos, pedidos e aumente suas vendas.
							</p>

							<ul className='text-sm text-muted-foreground mb-6 space-y-2'>
								<li>✓ Cadastro gratuito</li>
								<li>✓ Dashboard completo</li>
								<li>✓ Gestão de produtos e estoque</li>
								<li>✓ Controle de pedidos</li>
								<li>✓ Relatórios de vendas</li>
							</ul>

							<Link href='/cadastro/merchant'>
								<Button
									className='w-full'
									size='lg'
									style={{ backgroundColor: '#FF6900', borderColor: '#FF6900' }}
								>
									Cadastrar Estabelecimento
									<ArrowRight className='h-4 w-4 ml-2' />
								</Button>
							</Link>
						</CardContent>
					</Card>

					{/* Cadastro Prestador */}
					<Card className='hover:shadow-lg transition-shadow'>
						<CardContent className='p-8 text-center'>
							<div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
								<User className='h-8 w-8' style={{ color: '#FF6900' }} />
							</div>

							<h3 className='text-2xl font-bold mb-4'>Sou Prestador</h3>
							<p className='text-muted-foreground mb-6'>
								Ofereça seus serviços profissionais e receba agendamentos.
								Gerencie sua agenda e aumente sua clientela.
							</p>

							<ul className='text-sm text-muted-foreground mb-6 space-y-2'>
								<li>✓ Perfil profissional completo</li>
								<li>✓ Gestão de serviços e preços</li>
								<li>✓ Agenda de agendamentos</li>
								<li>✓ Portfólio de trabalhos</li>
								<li>✓ Sistema de avaliações</li>
							</ul>

							<Link href='/cadastro/prestador'>
								<Button
									className='w-full'
									size='lg'
									style={{ backgroundColor: '#FF6900', borderColor: '#FF6900' }}
								>
									Cadastrar como Prestador
									<ArrowRight className='h-4 w-4 ml-2' />
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>

				<div className='text-center mt-12'>
					<p className='text-muted-foreground'>
						Já possui cadastro?
						<Link href='/login' className='text-primary hover:underline ml-1'>
							Faça login aqui
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
