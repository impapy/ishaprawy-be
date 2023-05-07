import { CARD_NUMBER_LENGTH, CVV_LENGTH, PASSWORD_MIN_LENGTH } from '../constants'

export default {
  PHONE_EXIST: {
    en: 'Phone number already exists',
    ar: 'رقم التليفون مستخدم مسبقًا',
  },
  ERROR_WHILE_CREATING_STUDENT: {
    en: 'Error while creating STUDENT',
    ar: 'خطأ أثناء إنشاء البائع',
  },
  INVALID_EMAIL: {
    en: 'Email address is not valid',
    ar: 'ادخل البريد الإلكتروني بشكل صحيح',
  },
  SERVER_ERROR: { en: 'Server Error', ar: 'خطأ في الخادم' },
  EMAIL_EXIST: {
    en: 'Email already exists',
    ar: 'البريد الإلكتروني مستخدم مسبقًا',
  },
  VERIFY_ACCOUNT: {
    en: 'Verify Picklegum account',
    ar: 'فعل حساب بيكلجام',
  },
  YOUR_VERIFICATION_CODE: {
    en: 'is your verification code',
    ar: 'هو كود التفعيل الخاص بك',
  },
  ADMIN_NOT_FOUND: { en: 'Admin not found', ar: 'أدمن غير موجود' },
  USERNAME_EXIST: { en: 'Username already exists', ar: 'اسم المستخدِم مستخدَم مسبقًا' },
  ACCOUNT_NOT_FOUND: { en: 'Account not found', ar: 'حساب غير موجود' },
  INCORRECT_CODE: { en: 'Incorrect verification code', ar: 'كود غير صحيح' },
  INCORRECT_CREDENTIALS: { en: 'Incorrect username or password', ar: 'خطأ في اسم المستخدم/ كلمة المرور' },
  ACCOUNT_SUSPENDED: { en: 'Account Suspended', ar: 'الحساب مغلق' },
  UNAUTHORIZED: { en: 'Unauthorized Action', ar: 'خطوة غير مسموح بها' },
  INCORRECT_PASSWORD: { en: 'Incorrect password', ar: 'كلمة مرور خاطئة' },
  CODE_EXPIRED: { en: 'Code expired', ar: 'انتهت صلاحية الكود' },
  FILE_TYPE_NOT_ALLOWED: { en: 'File Type not allowed', ar: 'نوع الملف غير مسموح به' },
  MAX_FILE_SIZE_EXCEEDED: { en: 'File size must be smaller than {size}MB', ar: 'حجم الملف لا يجب ان يتعدى {size}ميجا' },
  NAME_EXISTS: { en: 'name already exists', ar: 'الاسم مستخدم مسبقا' },
  STUDENT_EXISTS: { en: 'STUDENT is already exists', ar: 'الاسم مستخدم مسبقا' },
  YOUR_NEW_PASSWORD: {
    en: 'Your new password for doctalk is: ',
    ar: 'كلمة السر الجديدة:',
  },
  RESET_PASSWORD_CODE: {
    en: 'Reset password code for ishaprawy is: ',
    ar: 'كود التأكيد من موقع مستر شبراوي:',
  },
  TERMS_AND_CONDITIONS_NOT_FOUND: {
    en: 'Terms and conditions are not found',
    ar: 'لم يتم العثور على الشروط والأحكام',
  },
  PRIVACY_POLICY_NOT_FOUND: {
    en: 'Privacy policy are not found',
    ar: 'لم يتم العثور على سياية الخصوصية',
  },
  USERNAME_REQUIRED: { en: 'username is required', ar: 'اسم المستخدم مطلوب' },
  NOTIFICATION_NOT_FOUND: {
    en: 'Notification is not found',
    ar: 'اشعار غير موجود',
  },
  CONTACT_FORM_NOT_FOUND: {
    en: 'Contact form is not found',
    ar: 'نموذج الاتصال غير موجود',
  },
  COULD_NOT_SEND_EMAIL: {
    en: 'Could not send email',
    ar: 'غير قادر علي ارسال ايميل',
  },
  OTP_EXPIRED_OR_DELETED: {
    en: 'Your OTP is expired or incorrect',
    ar: 'كود التأكيد منتهي أو غير صحيح',
  },
  ACCOUNT_NOT_CONFIRMED: {
    en: 'Your account not confirmed yet',
    ar: 'الحساب الخاص بك غير مفعل',
  },
  NOT_FOUND: {
    en: 'Not found',
    ar: 'غير موجود',
  },
  PASSWORD_TOO_SHORT: {
    en: `Password should be longer than ${PASSWORD_MIN_LENGTH} characters.`,
    ar: `احرف ${PASSWORD_MIN_LENGTH}يجب ان يكون الرقم السري اطول من `,
  },
  INVALID_URL: {
    en: `The provided url is not valid`,
    ar: `غير صحيح url`,
  },
  PRODUCT_NOT_FOUND: {
    en: 'The product you trying to associate the variant with not found',
    ar: 'منتج غير موجود',
  },
  PRODUCT_HAS_VARIANTS: {
    en: "The product you're trying to delete has associate variants",
    ar: 'لا يمكن حذف المنتج',
  },
  COULDNT_ADD_PRODUCT: {
    en: 'Could not add product',
    ar: 'غير قادر علي اضافة المنتج',
  },
  AT_LEAST_ONE_ITEM: {
    en: 'You have to provide at least one item',
    ar: 'وفر عنصر واحد علي الاقل',
  },
  ERROR_WHILE_AUTHENTICATING_FACEBOOK: {
    en: `Error while authenticating with facebook`,
    ar: `خطأ في التحقق من الحساب من خلال الفيسبوك`,
  },
  ERROR_WHILE_AUTHENTICATING_GOOGLE: {
    en: `Error while authenticating with google`,
    ar: `خطأ في التحقق من الحساب من خلال الجوجل`,
  },
  COUNTRY_NOT_FOUND: {
    en: `Country not exists`,
    ar: `هذة المحافظة غير موجودة`,
  },
  GOVERNORATE_NOT_FOUND: {
    en: `Governorate not exists`,
    ar: `هذة المحافظة غير موجودة`,
  },
  DISTRICT_NOT_FOUND: {
    en: `District not exists`,
    ar: `هذة المحافظة غير موجودة`,
  },
  COLLECTED_AMOUNT_LESS_THAN_TOTAL: {
    en: `The collected amount can't be less than the total`,
    ar: `لا يمكن ان يكون المبلغ اقل من المجموع الكلي`,
  },
  ONE_OPTION_AT_LEAST: {
    en: 'You have to provide at least one option from each product attribute for each variant of the product',
    ar: 'يجب ادخال خيار واحد علي الاقل لكل منتج',
  },
  CANVAS_NAME_EXIST: {
    en: 'Name already exists',
    ar: 'الاسم موجود بالفعل',
  },
  CATEGORY_OR_SUB_CATEGORY_NAME_EXIST: {
    en: 'Cayegory Or Sub Category Name Exest',
    ar: 'الفئه او الفئه الفرعيه مستخدم سابقا',
  },
  COLLECTION_NAME_EXIST: {
    en: 'Collection Name Exest',
    ar: 'اسم المجموعه مستخدم سابقا',
  },
  PRICING_CATEGORY_NAME_EXIST: {
    en: 'Pricing Category Name Already Exists',
    ar: 'اسم فئه التسعير مستخدم سابقا',
  },
  STUDENT_NOT_FOUND: {
    en: 'STUDENT NOT FOUND',
    ar: 'التاجر غير موجود',
  },
  CANNOT_ADD_ORDER: {
    en: 'You Cannot Add A New Order',
    ar: 'لا يمكنك اضافة اوردر جديد',
  },
  PHONE_REQUIRED: {
    en: 'Phone is required',
    ar: 'رقم الهاتف مطلوب',
  },
  COULD_NOT_INITIATE_PAYMENT: {
    en: 'could not initiate payment with paymob',
    ar: 'لا يمكن تحديد الدفع مع بيموب',
  },
  DEACTIVATED_STUDENT: {
    en: 'This STUDENT has been diactivated',
    ar: 'تم إلغاء تنشيط هذا البائع',
  },
  NO_ENOUGH_BALANCE: {
    en: "You don't have enough balance",
    ar: 'ليس لديك رصيد كافي',
  },
  CANNOT_UPDATE_ORDER: {
    en: 'Cannot Update This Order',
    ar: 'لا يمكنك تعديل هذا الاوردر',
  },
  STUDENT_EXIST_ANOTHER_PRICING_CATEGORY: {
    en: 'STUDENT already exists another pricing category',
    ar: 'التاجر مستخدم مسبقًا',
  },
  CARD_NUMBER_TOO_SHORT: {
    en: `Card number should be equal ${CARD_NUMBER_LENGTH} characters.`,
    ar: `رقم ${CARD_NUMBER_LENGTH}يجب ان يكون الرقم مكون من  `,
  },
  CVV_TOO_SHORT: {
    en: `CVV number should be equal ${CVV_LENGTH} characters.`,
    ar: `ارقام ${CVV_LENGTH}يجب ان يكون الرقم مكون من  `,
  },
  CANNOT_ADD_STATUS: {
    en: `This order is closed already.`,
    ar: `هذاالاوردر مغلق مسبقًا`,
  },
  DESIGNED_VARIANTS_HAS_ORDERS: {
    en: "The designed Variant you're trying to delete has associate order",
    ar: 'لا يمكن حذف المنتج',
  },
}
