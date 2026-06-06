import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useReferralData } from '@/hooks/useReferralData';
import { formatCurrencyI18n } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Gift, Users, DollarSign, CircleCheck as CheckCircle2, TrendingUp,
  Share2, UserPlus, MousePointerClick, Crown, CreditCard, Copy,
  CircleAlert as AlertCircle, FileText, Ticket, Wallet, Store,
} from 'lucide-react';
import { toast } from 'sonner';
import PixKeyDialog from '@/components/referral/PixKeyDialog';
import WithdrawalDialog from '@/components/referral/WithdrawalDialog';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.substring(0, 2);
  return `${visible}***@${domain}`;
}

function getPlanBadge(planStatus: string) {
  switch (planStatus) {
    case 'active':
      return <Badge>Ativo</Badge>;
    case 'free':
      return <Badge variant="secondary">Grátis</Badge>;
    case 'expired':
      return <Badge variant="destructive">Expirado</Badge>;
    default:
      return <Badge variant="secondary">{planStatus}</Badge>;
  }
}

export default function ReferralPage() {
  const { user } = useAuth();
  const { stats, pixKeys, referralLink, clickCount, referredUsers, isLoading, refreshData, error } = useReferralData(user?.id);
  const [showPixDialog, setShowPixDialog] = useState(false);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);

  const referralCode = referralLink ? referralLink.split('ref=')[1] || '' : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Link copiado para área de transferência!');
    } catch {
      toast.error('Erro ao copiar link');
    }
  };

  const copyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success('Código copiado!');
    } catch {
      toast.error('Erro ao copiar código');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !referralLink) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Não foi possível gerar seu link de indicação. Por favor, recarregue a página.'}
          </AlertDescription>
        </Alert>
        <Button onClick={refreshData} className="w-full max-w-md mx-auto block">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground mb-4">
          <Gift className="h-8 w-8 text-background" />
        </div>
        <h1 className="text-4xl font-bold">Indique e Ganhe</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compartilhe o VitrineTurbo e ganhe <span className="font-bold text-foreground">30% de comissão</span> por cada indicação que ativar um plano. Seu indicado ganha <span className="font-bold text-foreground">20% de desconto</span>!
        </p>
      </div>

      {/* How it Works Section - 4 steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Como Funciona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground">
                <Share2 className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-semibold">1. Compartilhe</h3>
              <p className="text-sm text-muted-foreground">
                Envie seu link ou código para amigos e seguidores
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground">
                <Ticket className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-semibold">2. Eles Ganham 20%</h3>
              <p className="text-sm text-muted-foreground">
                Quem usar seu link ou código ganha 20% de desconto no plano
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground">
                <DollarSign className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-semibold">3. Você Ganha 30%</h3>
              <p className="text-sm text-muted-foreground">
                Quando assinam, você recebe 30% do valor automaticamente
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground">
                <Wallet className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-semibold">4. Saque via PIX</h3>
              <p className="text-sm text-muted-foreground">
                Solicite seu saque via PIX quando quiser
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Link Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Seu Link de Indicação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={copyToClipboard} className="shrink-0">
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coupon Code Section */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Seu Cupom de Desconto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-lg bg-muted px-5 py-4 text-center">
              <span className="text-2xl font-bold font-mono tracking-wider">{referralCode}</span>
            </div>
            <Button onClick={copyCodeToClipboard} variant="outline" className="shrink-0">
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Compartilhe este código e quem usá-lo no checkout ganha 20% de desconto. Você ganha 30% de comissão automaticamente.
          </p>
        </CardContent>
      </Card>

      {/* Footer Logo Tip */}
      <Alert className="border-border bg-muted/50">
        <Store className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Dica:</strong> Seu link de indicação também está presente na logomarca VitrineTurbo no rodapé do seu catálogo.
        </AlertDescription>
      </Alert>

      {/* Commission Plans */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">R$ 44,70</div>
            <div className="text-sm text-muted-foreground">Plano Trimestral</div>
            <Badge variant="secondary" className="text-xs">30% de R$ 149</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted">
              <Crown className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">R$ 68,70</div>
            <div className="text-sm text-muted-foreground">Plano Semestral</div>
            <Badge variant="secondary" className="text-xs">30% de R$ 229</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted">
              <Gift className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">R$ 100,80</div>
            <div className="text-sm text-muted-foreground">Plano Anual</div>
            <Badge variant="secondary" className="text-xs">30% de R$ 336</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Separator between promotional and metrics sections */}
      <Separator className="my-2" />

      {/* Minhas Metricas Section */}
      <section className="bg-muted/30 dark:bg-muted/10 border rounded-xl p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Minhas Métricas</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Cliques no Link</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clickCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Total de Indicados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referredUsers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.activeReferrals || 0} com plano ativo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Comissões Totais</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrencyI18n(stats?.totalCommissions || 0, 'BRL', 'pt-BR')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Disponível p/ Saque</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrencyI18n(stats?.availableForWithdrawal || 0, 'BRL', 'pt-BR')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Comissões Pagas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrencyI18n(stats?.paidCommissions || 0, 'BRL', 'pt-BR')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Referred Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Seus Indicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referredUsers.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <UserPlus className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Nenhum indicado ainda.</p>
                <p className="text-xs mt-1">Compartilhe seu link ou código e comece a ganhar!</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Plano</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referredUsers.map((referred) => (
                      <TableRow key={referred.id}>
                        <TableCell className="font-medium">{referred.name || '\u2014'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{maskEmail(referred.email)}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(referred.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{getPlanBadge(referred.plan_status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PIX and Withdrawal Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Chave PIX
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pixKeys.length > 0 ? (
                <div className="space-y-2">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{pixKeys[0].holder_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pixKeys[0].pix_key_type.toUpperCase()}: {pixKeys[0].pix_key}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowPixDialog(true)}
                  >
                    Editar Chave PIX
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Configure sua chave PIX para receber os saques
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => setShowPixDialog(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Configurar PIX
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Solicitar Saque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-4xl font-bold">
                  {formatCurrencyI18n(stats?.availableForWithdrawal || 0, 'BRL', 'pt-BR')}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Disponível para saque</p>
              </div>

              {(stats?.availableForWithdrawal || 0) >= 50 ? (
                <Button
                  className="w-full"
                  onClick={() => setShowWithdrawalDialog(true)}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Solicitar Saque
                </Button>
              ) : (
                <Button className="w-full" disabled variant="secondary">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Solicitar Saque
                </Button>
              )}

              <p className="text-xs text-center text-muted-foreground">
                {pixKeys.length === 0
                  ? 'Configure sua chave PIX primeiro'
                  : 'Valor mínimo para saque: R$ 50,00'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Link */}
      <div className="text-center py-4">
        <Link
          to="/termos-indicacoes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileText className="h-4 w-4" />
          Termos e Condições do Programa de Indicações
        </Link>
      </div>

      {/* Dialogs */}
      <PixKeyDialog
        open={showPixDialog}
        onOpenChange={setShowPixDialog}
        onSuccess={refreshData}
        existingKey={pixKeys[0] || null}
      />

      <WithdrawalDialog
        open={showWithdrawalDialog}
        onOpenChange={setShowWithdrawalDialog}
        onSuccess={refreshData}
        availableAmount={stats?.availableForWithdrawal || 0}
        pixKeys={pixKeys}
        onConfigurePixKey={() => {
          setShowWithdrawalDialog(false);
          setShowPixDialog(true);
        }}
      />
    </div>
  );
}
