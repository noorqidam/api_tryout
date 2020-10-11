const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const mongoose = require('mongoose')
let urlDatabase = require('./config/db')

//const MessageBusUjian = require('./message/CreateQueueUjian')

/**
 * include Consumers Message Broker Redis
 */
//const ConsumerQuiz = require('./consumers/QuizConsumers')

/** Set Connection MongoDB */
mongoose.set('debug', true)
mongoose.connect(urlDatabase.development, { useNewUrlParser : true , useUnifiedTopology: true , useFindAndModify: false , autoIndex: false })

const connectMongoDB = mongoose.connection
connectMongoDB.on('error', console.error.bind(console,'connection error'))

/** Include Middleware 
 *@requires auth { token }
*/
const Middleware = require('./middleware/auth')
const MiddlewareEdutore = require('./middleware/edutore/edutore')
const MiddlewareFirebase = require('./middleware/firebase/app')
const SingleStartQuiz = require('./middleware/quiz/singleStart')
const MySoal = require('./middleware/quiz/mySoalQuiz')
const MySoalUjian = require('./middleware/ujian/mySoalUjian')
const CheckStartQuiz = require('./middleware/quiz/time')
const RoleBankSoal = require('./middleware/bankssoal/role')
const RoleQuiz = require('./middleware/quiz/role')

/** Peserta Controller */  
const LoginAccessLogController = require('./routes/peserta/Auth/LogAccessLoginController')
const CheckPesertaController = require('./routes/peserta/Auth/CheckUserController')
const CheckPhoneExsitController  = require('./routes/peserta/Auth/CheckUserPhoneController')
const RegisterPesertaController = require('./routes/peserta/Auth/RegisterController')
const RegisterAutoVerifyController  = require('./routes/peserta/Auth/RegisterAutoVerifyController')
const ReSendMailActivationController  = require('./routes/peserta/Auth/SendMailRegisterController')
const LoginPesertaController  = require('./routes/peserta/Auth/LoginPesertaController')
const SoalUjianPesertaController = require('./routes/peserta/Ujian/soalUjianController')
const SoalUjianMandiriController  = require('./routes/peserta/Ujian/mandiri/SoalUjianMandiriController')
const FindJawabanUjianController = require('./routes/peserta/FindjawabanController')
const PesertaJawabSoalUjianController = require('./routes/peserta/Ujian/JawabSoalUjianController')
const UjianPersertaController = require('./routes/peserta/Ujian/ujianController')
const QuiPesertaController  = require('./routes/peserta/Quiz/quizController')
const SoalQuizPesertaController = require('./routes/peserta/Quiz/soalQuizController')
const JawabQuizPesertaController = require('./routes/peserta/Quiz/jawabQuizController')
const GetRattingQuizController  = require('./routes/v1/monitoring/GetRattingQuizController')
const NilaiQuizPesertaController = require('./routes/peserta/Quiz/NilaiQuizController')
const FindJawabanQuizController = require('./routes/peserta/Quiz/findJawabanQuizController')
const NilaiUjianController  = require('./routes/peserta/Ujian/GetNilaiUjianController')
const ReferenceQuizController = require('./routes/peserta/Quiz/referensiQuizController')
const ValidatePinAccessQuizController = require('./routes/peserta/Quiz/accessPinController')
const SoalQuizPrivateController = require('./routes/peserta/Quiz/soalQuizPrivateController')
const GetLiveQuizController = require('./routes/peserta/Quiz/quizLiveController')
const GetLiveUjianController  = require('./routes/peserta/Ujian/ujianLiveController')
const ValidatePinAccessUjianController  = require('./routes/peserta/Ujian/accessPinUjianController')
const reltimepointController  = require('./routes/peserta/Quiz/reatimePointController')
const JawabQuizRealtimeSoalController = require('./routes/peserta/Quiz/jawabQuizRealtimeSoalController')
const SoalUjianPrivateController = require('./routes/peserta/Ujian/SoalUjianPrivateController')
const SendMailNilaiQuizController = require('./routes/peserta/Quiz/SendMailNilaiQuizController')
const jadwalSesiUjianController=  require('./routes/peserta/Ujian/jadwalSesiUjianController')
const historyQuizController = require('./routes/peserta/Quiz/historyQuizController')
const HistoryUjianController  = require('./routes/peserta/Ujian/historyUjianController')
const ProductBooksController  = require('./routes/peserta/Books/BookController')
const ValidateLinkRegisterController = require('./routes/v1/referal/referalValidateController')
const PesertaPointQuizController =  require('./routes/peserta/Quiz/realtime/pointController')
const UjianMandiriController  = require('./routes/peserta/Ujian/mandiri/UjianMandiriController')
const PackageSubscriptionController = require('./routes/peserta/subscriptions/indexController')
const StopUjianController = require('./routes/peserta/Ujian/akhiriUjianController')
const ProfileController = require('./routes/peserta/profile/profileController')

/**
 * Module Latihan Soal
 */
const ModuleLatihanSoalController = require('./routes/peserta/v2/SoalController')
const CountModuleLatihanSoalControler = require('./routes/peserta/v2/CountSoalController')
/**tesing view email */
//const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const LoginController = require('./routes/v1/auth/loginController')
const BanksSoalController = require('./routes/v1/banksoal/indexController')
const UjianController   = require('./routes/v1/ujian/indexController')
const SoalUjianController = require('./routes/v1/soal_ujian/indexController')
const AggregationController = require('./routes/v1/banksoal/aggregationController')
const SesiUjianController   = require('./routes/v1/sesi_ujian/indexController')
const PesertaUjianController = require('./routes/v1/ujian/PesertaUjianController')
const PublisherController   = require('./routes/v1/publishers/publisherController')
const QuizController = require('./routes/v1/quiz/quizController')
const DeleteQuizController = require('./routes/v1/quiz/deleteQuiz')
const SoalQuizController  = require('./routes/v1/quiz/soalQuizController')
const MonitoringLiveTestController  = require('./routes/v1/monitoring/GetLiveTestController')
const MonitoringLiveQuizController  = require('./routes/v1/monitoring/GetLiveQuizController')
const CategoryQuizController = require('./routes/v1/category/quizCategoryController')
const CategoryUjianController = require('./routes/v1/category/ujianCategoryController')
const MataPelajaranController = require('./routes/v1/matapelajaran/matapelajaranController')
const CreateBanksSoalController = require('./routes/v1/banksoal/createbankSoalController')
const RatingPesertaQuizController = require('./routes/v1/quiz/ratingPeserta')
const DetailNilaiPesertaQuizController = require('./routes/v1/quiz/detailRatingPeserta')
const RatingPesertaUjianController = require('./routes/v1/ujian/ratingPeserta')
const DetailNilaiPesertaUjianController = require('./routes/v1/ujian/detailRatingPeserta')
const CampaignController = require('./routes/v1/campaign/indexController')
const AddCampaignController = require('./routes/v1/campaign/createCampaign')
const PesertaQuizController = require('./routes/v1/quiz/PesertaQuizController')
const UpdateBannerQuizController = require('./routes/v1/quiz/updateQuizBannerController')
const RealtimeSoalQuizController  = require('./routes/v1/quiz/realtimeSoalQuizController')
const UpdateUjianBannerController = require('./routes/v1/ujian/updateUjianBannerController')
const DetailUjianPerSesiController = require('./routes/v1/ujian/detailUjianPerSesiController')
const BookController = require('./routes/v1/books/booksController')
const ReferalLinkRegisterController = require('./routes/v1/referal/RegisterReferalLinkController')
const reviewUjianController = require('./routes/v1/ujian/reviewUjian')
const MasterReferalController = require('./routes/v1/referal/SearchMasterReferalController')
const NilaiAkhirUjianController = require('./routes/v1/ujian/nilaiAkhirUjianController')
const ReportUjianAdmin = require('./routes/v1/ujian/reportUjian')
const DeleteUjianController = require('./routes/v1/ujian/deleteUjian')
const DetailNilaiPesertaQuizRealtimeController = require('./routes/v1/quiz/detailRatingPesertaQuizRealtimeController')
const SendMailNilaiQuizAdminController = require('./routes/v1/quiz/sendMailNilaiQuizController')
const SendMailNilaiUjianAdminController = require('./routes/v1/ujian/sendMailNilaiUjianController')
const TrashUjianController = require('./routes/v1/ujian/deletedUjianController')
const TrashQuizController = require('./routes/v1/quiz/deletedQuizController')
const DashboardController  = require('./routes/v1/dashboard/dashboardController')
const UserActivitiesLoginController = require('./routes/v1/dashboard/DashboardUserLoginActivitiesController')

/**
 * Partner Router 
 * @requires auth
 * @body authorized { admin ,staff}
 */
const DashboardPublisheerController  = require('./routes/v1/dashboard/dashboardPublisherController')
const BankSoalPartnerController = require('./routes/v1/banksoal/BankSoalPublisherController')
const deleteBankSoalPublisherController = require('./routes/v1/banksoal/deleteBanksoalPublisherController')
const CreateBankSoalPublisherController = require('./routes/v1/banksoal/createBankSoalPublisherController')
const UjianByPublisherController = require('./routes/v1/ujian/ujianByPublisherController')
const QuizByPublisherController = require('./routes/v1/quiz/quizPublisherController')
const SoalUjianByPublisherController  = require('./routes/v1/soal_ujian/soalujianPublisherController')
const SesiUjianPublisherController  = require('./routes/v1/sesi_ujian/sesiujianPublisherController')
const SoalQuizPublisherController = require('./routes/v1/quiz/soalQuizPublisherController')
const updateQuizBannerPublisherController = require('./routes/v1/quiz/updateQuizBannerPublisherController')
const updateUjianBannerPublisherController  = require('./routes/v1/ujian/updateUjianBannerPublisherController')
const MasterMenuPublisherController = require('./routes/v1/mastermenu/masterMenuPublisherController')
const registerAdminPublisherController = require('./routes/v1/auth/registerPublisherController')
const ReportQuizPublisherController = require('./routes/v1/quiz/reportPesertaQuizPublisherController')
const DeleteQuizPublisherController = require('./routes/v1/quiz/deleteQuizPublisherController')
const AddPesertaUjianPublisherController = require('./routes/v1/ujian/addPesertaPublisherController')
const AdminLisPublisherController = require('./routes/v1/admin/adminPublisherController')
const GetLiveQuizPublisherController  = require('./routes/v1/monitoring/GetliveQuizPublisherController')
const GetliveUjianPublisherController = require('./routes/v1/monitoring/GetLiveUjianPublisherController')
const DeleteUjianPublisherController  = require('./routes/v1/ujian/DeleteUjianPublisherController')
const GetAllSesiUjianPublisherController  = require('./routes/v1/sesi_ujian/AllSesiinUjianPublisherController')
const JadwalUjianPublisherController = require('./routes/v1/ujian/jadwalSesiUjianController')
const DeleteJadwalUjianPublisherController  = require('./routes/v1/ujian/DeletejadwalSesiUjianPublisherController')
const BooksPublisherController  = require('./routes/v1/books/booksPublisherController')
const ModuleSoalController  = require('./routes/v1/theme/paket_soal/soalController')
const RatingPesertaQuizRealtimeController = require('./routes/v1/quiz/ratingPesertaQuizRealtimeController')
const SiswaPublisherController  = require('./routes/v1/siswa/siswaPublisherController')
const TrashUjianPublisherController = require('./routes/v1/ujian/deletedUjianPublisherController')
const TrashQuizPublisherController = require('./routes/v1/quiz/deletedQuizPublisherController')

/**
 * all routes
 */
const RealtimePointUjianController  = require('./routes/v1/ujian/realtimepointController')
const RealtimePointQuizController = require('./routes/v1/quiz/realtimepointQuizController')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, { transports: ['websocket', 'polling'] })

/** Whitelist Domain access CROS */
const whitelist = ['https://cms-tryout.edutore.com' ,'https://tes.edutore.com']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.set('trust proxy', true)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(helmet())
//app.use(cors(corsOptions));
app.use(cors())
app.disable('x-powered-by');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit : '60mb'}));
app.use(bodyParser.urlencoded({ limit: '60mb' ,extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  res.io = io;
  next();
});


/**
 * Run Consumers
 */
//ConsumerQuiz.subscribeAnswered('message')


/**
 * set api Versioning
 */
const API_VERSION ='/app/api/v1';
const API_ADMIN_VERSION ='/app/api-admin/v1';

//app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use(API_ADMIN_VERSION + '/login', LoginController)
app.use(API_ADMIN_VERSION + '/banksoal',Middleware,MiddlewareEdutore,BanksSoalController)
app.use(API_ADMIN_VERSION + '/create-banks-soal',Middleware, CreateBanksSoalController)
app.use(API_ADMIN_VERSION + '/ujian',Middleware,MiddlewareEdutore, UjianController)
app.use(API_ADMIN_VERSION + '/soal-ujian',Middleware,MiddlewareEdutore,SoalUjianController)
app.use(API_ADMIN_VERSION + '/group',AggregationController)
app.use(API_ADMIN_VERSION + '/sesi-ujian',Middleware,MiddlewareEdutore,SesiUjianController)
app.use(API_ADMIN_VERSION + '/peserta-ujian',Middleware,MiddlewareEdutore,PesertaUjianController)
app.use(API_ADMIN_VERSION + '/publishers',Middleware,MiddlewareEdutore,PublisherController)
app.use(API_ADMIN_VERSION + '/quiz',Middleware ,MiddlewareEdutore, QuizController)
app.use(API_ADMIN_VERSION + '/delete-quiz', Middleware,DeleteQuizController)
app.use(API_ADMIN_VERSION + '/soal-quiz',Middleware,SoalQuizController)
app.use(API_ADMIN_VERSION + '/live-test',Middleware,MiddlewareEdutore,MonitoringLiveTestController)
app.use(API_ADMIN_VERSION + '/live-quiz',Middleware,MiddlewareEdutore, MonitoringLiveQuizController)
app.use(API_ADMIN_VERSION + '/trigger-soal-quiz',RealtimeSoalQuizController)
app.use(API_ADMIN_VERSION + '/category-ujian', CategoryUjianController)
app.use(API_ADMIN_VERSION + '/category-quiz', CategoryQuizController)
app.use(API_ADMIN_VERSION + '/matapelajaran', MataPelajaranController)
app.use(API_ADMIN_VERSION + '/rating-peserta-quiz', RatingPesertaQuizController)
app.use(API_ADMIN_VERSION + '/detail-nilai-peserta-quiz', DetailNilaiPesertaQuizController)
app.use(API_ADMIN_VERSION + '/rating-peserta-ujian', RatingPesertaUjianController)
app.use(API_ADMIN_VERSION + '/detail-nilai-peserta-ujian', DetailNilaiPesertaUjianController)
app.use(API_ADMIN_VERSION + '/campaign', CampaignController)
app.use(API_ADMIN_VERSION + '/add-campaign', AddCampaignController)
app.use(API_ADMIN_VERSION + '/peserta-quiz', PesertaQuizController);
app.use(API_ADMIN_VERSION + '/update-quiz-banner',Middleware,UpdateBannerQuizController)
app.use(API_ADMIN_VERSION + '/update-ujian-banner', Middleware, UpdateUjianBannerController)
app.use(API_ADMIN_VERSION + '/detail-ujian-per-sesi', Middleware, DetailUjianPerSesiController)
app.use(API_ADMIN_VERSION + '/books',BookController)
app.use(API_ADMIN_VERSION + '/master-referal',MasterReferalController)
app.use(API_ADMIN_VERSION + '/referal-register',ReferalLinkRegisterController)
app.use(API_ADMIN_VERSION + '/nilai-akhir-ujian', Middleware, NilaiAkhirUjianController)
app.use(API_ADMIN_VERSION + '/delete-ujian', Middleware, DeleteUjianController)
app.use(API_ADMIN_VERSION + '/rating-peserta-quiz-realtime', Middleware, RatingPesertaQuizRealtimeController)
app.use(API_ADMIN_VERSION + '/detail-nilai-peserta-quiz-realtime', Middleware, DetailNilaiPesertaQuizRealtimeController)
app.use(API_ADMIN_VERSION + '/send-email-quiz', Middleware, SendMailNilaiQuizAdminController)
app.use(API_ADMIN_VERSION + '/send-email-ujian', Middleware, SendMailNilaiUjianAdminController)
app.use(API_ADMIN_VERSION + '/trash-ujian', Middleware, TrashUjianController)
app.use(API_ADMIN_VERSION + '/trash-quiz', Middleware, TrashQuizController)
app.use(API_ADMIN_VERSION + '/dashboard-admin',Middleware,DashboardController)
app.use(API_ADMIN_VERSION + '/dashboard-login',UserActivitiesLoginController)

/** publisher router */
app.use(API_ADMIN_VERSION + '/dashboard',Middleware,DashboardPublisheerController)
app.use(API_ADMIN_VERSION + '/publisher-banksoals',Middleware,BankSoalPartnerController)
app.use(API_ADMIN_VERSION + '/publisher-create-banksoal',Middleware,CreateBankSoalPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-delete-bank-soal',Middleware,RoleBankSoal,deleteBankSoalPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-ujian',Middleware,UjianByPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-quiz',Middleware,QuizByPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-soal-quiz', Middleware, SoalQuizPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-soal-ujian',Middleware,SoalUjianByPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-sesi-ujian',Middleware,SesiUjianPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-update-banner-quiz',Middleware,updateQuizBannerPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-update-banner-ujian', Middleware,updateUjianBannerPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-master-menu', MasterMenuPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-add-admin',Middleware,registerAdminPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-report-quiz', Middleware,ReportQuizPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-delete-quiz', Middleware,RoleQuiz,DeleteQuizPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-admin-list', Middleware,AdminLisPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-live-quiz',Middleware,GetLiveQuizPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-live-ujian',Middleware,GetliveUjianPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-delete-ujian', Middleware,DeleteUjianPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-sesi-in-ujian',GetAllSesiUjianPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-jadwal-ujian',JadwalUjianPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-hapus-jadwal-ujian',Middleware,DeleteJadwalUjianPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-books',Middleware,BooksPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-module-soal', ModuleSoalController)
app.use(API_ADMIN_VERSION + '/report-ujian-admin', Middleware, ReportUjianAdmin)
app.use(API_ADMIN_VERSION + '/review-sesi-ujian',Middleware,reviewUjianController)
app.use(API_ADMIN_VERSION + '/rating-peserta-quiz-realtime', Middleware, RatingPesertaQuizRealtimeController)
app.use(API_ADMIN_VERSION + '/publisher-siswa-list',Middleware,SiswaPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-trash-ujian', Middleware, TrashUjianPublisherController)
app.use(API_ADMIN_VERSION + '/publisher-trash-quiz', Middleware, TrashQuizPublisherController)

/**all routes */
app.use(API_ADMIN_VERSION + '/realtime-point-ujian', RealtimePointUjianController)
app.use(API_ADMIN_VERSION + '/realtime-point-quiz',RealtimePointQuizController)


/** Peserta Router */
app.use(API_VERSION + '/log-login',LoginAccessLogController)
app.use(API_VERSION + '/check-peserta',CheckPesertaController)
app.use(API_VERSION + '/check-phone',CheckPhoneExsitController)
app.use(API_VERSION + '/peserta-login', LoginPesertaController)
app.use(API_VERSION + '/peserta-register', RegisterPesertaController)
app.use(API_VERSION + '/peserta-register-auto',RegisterAutoVerifyController)
app.use(API_VERSION + '/referal-validate', ValidateLinkRegisterController)
app.use(API_VERSION + '/peserta-resend-mail-register',ReSendMailActivationController)
app.use(API_VERSION + '/all-ujian', UjianPersertaController)
app.use(API_VERSION + '/live-ujian', GetLiveUjianController)
app.use(API_VERSION + '/all-quiz' ,QuiPesertaController)
app.use(API_VERSION + '/live-quiz' , GetLiveQuizController)
app.use(API_VERSION + '/jadwal-sesi-ujian',jadwalSesiUjianController)
app.use(API_VERSION + '/soal-ujian-in-sesi',MiddlewareFirebase,MySoalUjian,SoalUjianPesertaController)
app.use(API_VERSION + '/soal-ujian-mandiri',MiddlewareFirebase,MySoalUjian,SoalUjianMandiriController)
app.use(API_VERSION + '/soal-ujian-private-in-sesi' , MiddlewareFirebase,MySoalUjian,SoalUjianPrivateController)
app.use(API_VERSION + '/check-jawaban-in-sesi-ujian',MiddlewareFirebase,FindJawabanUjianController)
app.use(API_VERSION + '/check-jawaban-in-quiz', MiddlewareFirebase,FindJawabanQuizController)
app.use(API_VERSION + '/jawab-soal-ujian',MiddlewareFirebase,PesertaJawabSoalUjianController)
app.use(API_VERSION + '/reference-quiz', ReferenceQuizController)
app.use(API_VERSION + '/soal-quiz-peserta',MiddlewareFirebase,SingleStartQuiz,MySoal, SoalQuizPesertaController)
app.use(API_VERSION + '/jawab-quiz-peserta',MiddlewareFirebase, JawabQuizPesertaController)
app.use(API_VERSION + '/jawab-quiz-realtime-soal',MiddlewareFirebase,JawabQuizRealtimeSoalController)
app.use(API_VERSION + '/ratting-quiz' ,GetRattingQuizController)
app.use(API_VERSION + '/nilai-quiz',MiddlewareFirebase,NilaiQuizPesertaController)
app.use(API_VERSION + '/nilai-ujian',MiddlewareFirebase, NilaiUjianController)
app.use(API_VERSION + '/verify-pin-quiz',MiddlewareFirebase,ValidatePinAccessQuizController)
app.use(API_VERSION + '/verify-pin-ujian', MiddlewareFirebase,ValidatePinAccessUjianController)
app.use(API_VERSION + '/soal-quiz-private',CheckStartQuiz,MiddlewareFirebase, MySoal,SoalQuizPrivateController)
app.use(API_VERSION + '/send-nilai-quiz',MiddlewareFirebase,SendMailNilaiQuizController)
app.use(API_VERSION + '/history-quiz',MiddlewareFirebase,historyQuizController)
app.use(API_VERSION + '/history-ujian',MiddlewareFirebase,HistoryUjianController)
app.use(API_VERSION + '/product-modules',ProductBooksController)
app.use(API_VERSION + '/ujian-mandiri',UjianMandiriController) // ujian terkait promosi 
app.use(API_VERSION + '/package-subscription',PackageSubscriptionController)
app.use(API_VERSION + '/stop-ujian',MiddlewareFirebase,StopUjianController)

app.use(API_VERSION + '/realtime-quiz-point',MiddlewareFirebase,reltimepointController)
app.use(API_VERSION + '/realtime-point-quiz',PesertaPointQuizController)
app.use(API_VERSION + '/profile',MiddlewareFirebase,ProfileController)
/**
 * endpoint Module Latihan Soal
 */
app.use(API_VERSION + '/my-subscription-soal',ModuleLatihanSoalController)
app.use(API_VERSION + '/my-module-soal',ModuleLatihanSoalController)
app.use(API_VERSION + '/count-my-module-soal',CountModuleLatihanSoalControler)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.status(404).json({
    success : 'false',
    message :'Request Not Found'
  });
  //next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //console.log(error)
  return res.status(500).json({
    success : 'false',
    message :{
      data: "Server Error"
    }
  });
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

setInterval(() => {
  let gettime = new Date().toString()
  io.emit('show_timer', gettime)
}, 1000);

// ConsumerQuiz.subscribeNofify('quiz')
// MessageBusUjian.createQueueUjian('ujian')

module.exports = { app: app, server: server };